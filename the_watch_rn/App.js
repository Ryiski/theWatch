import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import SideMenu from './SideMenu';
import {Home} from './screen/Home';
import {MoviesList} from './screen/MoviesList';
import {MovieDetails} from './screen/MovieDetails';
import {Watch} from './screen/Watch';

import {Search} from './screen/Search';
import Orientation from 'react-native-orientation';
import AsyncStorage from '@react-native-community/async-storage';
import {inject} from 'mobx-react';

const {Navigator, Screen} = createDrawerNavigator();

const getWatchMode = async (store) => {
  const value = await AsyncStorage.getItem('watchMode');

  if (value !== null && store.watchMode === false) {
    store.change({
      watchMode: JSON.parse(value),
    });
  }
};

const App = inject('store')(({store}) => {
  useEffect(() => {
    Orientation.lockToPortrait();
    return () => {
      Orientation.unlockAllOrientations();
    };
  });

  useEffect(() => {
    getWatchMode(store);
  }, [store]);

  return (
    <NavigationContainer>
      <Navigator
        drawerStyle={{backgroundColor: null, flex: 1}}
        drawerContent={(props) => <SideMenu {...props} />}
        initialRouteName="Home">
        <Screen name="Home" component={Home} />
        <Screen name="MoviesList" component={MoviesList} />
        <Screen
          name="MovieDetails"
          component={MovieDetails}
          options={{unmountOnBlur: true}}
        />
        <Screen
          name="Search"
          component={Search}
          options={{unmountOnBlur: true}}
        />
        <Screen
          name="Watch"
          component={Watch}
          options={{unmountOnBlur: true}}
        />
      </Navigator>
    </NavigationContainer>
  );
});

export default App;
