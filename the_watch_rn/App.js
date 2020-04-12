import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import SideMenu from './SideMenu';
import {Home} from './screen/Home';
import {MoviesList} from './screen/MoviesList';
import {MovieDetails} from './screen/MovieDetails';
import {Search} from './screen/Search';
import Orientation from 'react-native-orientation';
const {Navigator, Screen} = createDrawerNavigator();

const App = () => {
  useEffect(() => {
    Orientation.lockToPortrait();
    return () => {
      Orientation.unlockAllOrientations();
    };
  });
  return (
    <NavigationContainer>
      <Navigator
        drawerStyle={{backgroundColor: null, flex: 1}}
        drawerContent={props => <SideMenu {...props} />}
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
      </Navigator>
    </NavigationContainer>
  );
};

export default App;
