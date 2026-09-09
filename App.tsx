import { useHeaderHeight } from '@react-navigation/elements';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  type NativeStackScreenProps,
} from '@react-navigation/native-stack';
import React, { useLayoutEffect } from 'react';
import {
  Button,
  FlatList,
  type ListRenderItem,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import PagerView from 'react-native-pager-view';
import { SafeAreaProvider } from 'react-native-safe-area-context';

type RootStackParamList = {
  Home: undefined;
  PlainList: undefined;
  PagerList: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

type HomeProps = NativeStackScreenProps<RootStackParamList, 'Home'>;
type SearchScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'PlainList' | 'PagerList'
>;

const rows = Array.from({ length: 40 }, (_, index) => `Row ${index + 1}`);

function useSearchHeader(navigation: SearchScreenProps['navigation']) {
  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Items',
      headerSearchBarOptions: {
        placeholder: 'Search items',
        placement: 'stacked',
        hideWhenScrolling: false,
        hideNavigationBar: false,
        onChangeText: () => {},
      },
    });
  }, [navigation]);
}

const renderRow: ListRenderItem<string> = ({ item }) => (
  <View style={styles.row}>
    <Text style={styles.rowText}>{item}</Text>
  </View>
);

function ItemList() {
  // const headerHeight = useHeaderHeight();

  return (
    <FlatList
      contentInsetAdjustmentBehavior="automatic"
      data={rows}
      keyExtractor={item => item}
      renderItem={renderRow}
      // contentContainerStyle={{
      //   paddingTop: headerHeight,
      // }}
    />
  );
}

function HomeScreen({ navigation }: HomeProps) {
  return (
    <View style={styles.home}>
      <Text style={styles.heading}>PagerView + native search bar</Text>
      <Text style={styles.description}>
        Both screens use the same native-stack search bar and the same FlatList.
        The only difference is whether the list is inside PagerView.
      </Text>

      <View style={styles.buttons}>
        <Button
          title="Control: plain FlatList"
          onPress={() => navigation.push('PlainList')}
        />
        <Button
          title="Repro: FlatList in PagerView"
          onPress={() => navigation.push('PagerList')}
        />
      </View>
    </View>
  );
}

function PlainListScreen({ navigation }: SearchScreenProps) {
  useSearchHeader(navigation);

  return (
    <View style={styles.controlContainer}>
      <ItemList />
    </View>
  );
}

function PagerListScreen({ navigation }: SearchScreenProps) {
  useSearchHeader(navigation);

  return (
    <View style={styles.pagerContainer}>
      <PagerView style={styles.pager} initialPage={0}>
        <View key="items" style={styles.page} collapsable={false}>
          <ItemList />
          <View pointerEvents="none" style={styles.pageBottomMarker} />
        </View>

        <View key="checks" style={styles.secondPage} collapsable={false}>
          <Text style={styles.secondPageText}>Second page</Text>
        </View>
      </PagerView>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: 'Reproduction' }}
          />
          <Stack.Screen name="PlainList" component={PlainListScreen} />
          <Stack.Screen name="PagerList" component={PagerListScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  home: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    gap: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
  },
  buttons: {
    gap: 12,
  },
  controlContainer: {
    flex: 1,
    backgroundColor: '#b9f6ca',
  },
  pagerContainer: {
    flex: 1,
    backgroundColor: 'magenta',
  },
  pager: {
    flex: 1,
  },
  page: {
    flex: 1,
    backgroundColor: '#b9f6ca',
  },
  secondPage: {
    flex: 1,
    backgroundColor: '#bbdefb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondPageText: {
    fontSize: 24,
    fontWeight: '600',
  },
  row: {
    height: 64,
    justifyContent: 'center',
    marginHorizontal: 16,
    marginVertical: 4,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
  },
  rowText: {
    color: '#111111',
    fontSize: 18,
  },
  pageBottomMarker: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 3,
    backgroundColor: '#ff0000',
  },
});
