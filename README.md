# PagerView native search bar reproduction

Minimal iOS reproduction for a layout difference between a plain `FlatList`
and the same list rendered inside `react-native-pager-view` while using a
native-stack search bar.

## Environment

- React Native 0.87.1 (New Architecture)
- React 19.2.3
- `@react-navigation/native` 7.3.18
- `@react-navigation/native-stack` 7.18.10
- `react-native-screens` 4.27.0
- `react-native-pager-view` 9.0.4
- `react-native-safe-area-context` 5.9.1

## Run

```sh
npm install
bundle install
bundle exec pod install --project-directory=ios
npm run ios
```

Use an iPhone simulator with a non-zero safe area, such as iPhone 16 Pro or
iPhone 17 Pro.

## Steps to reproduce

1. Open **Control: plain FlatList**.
2. Verify that row 1 starts directly below the native search bar.
3. Navigate back.
4. Open **Repro: FlatList in PagerView**.
5. Compare the position of row 1 and the space below the list with the control.
6. Navigate back and repeat the push several times.
7. Focus and cancel the search bar, then swipe between pager pages.

Both screens intentionally use the same `headerSearchBarOptions`, the same
`FlatList`, and `contentInsetAdjustmentBehavior="automatic"`. The pager screen
only adds `PagerView` around the list. Using `automatic` is required here: with
`never`, the first rows can be obscured by the native search bar and the test no
longer represents the supported native-stack configuration.

## Expected

The first row and bottom edge of the list have the same positions on both
screens.

## Actual

With the affected iOS pager layout, the page inside `PagerView` can receive a
different safe-area/layout adjustment. This appears as extra space between the
search bar and row 1, a shortened page or an exposed magenta strip at the
bottom. The plain `FlatList` is the control and does not exhibit the mismatch.

The red three-point line belongs to the first pager page. The magenta color
belongs to the container outside `PagerView`, making a shortened pager page
easy to see.
