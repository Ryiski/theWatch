/**
 * @format
 */
import 'react-native-get-random-values';
import React, {useEffect} from 'react';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {Provider} from 'mobx-react';
import mobXState from './mobxStore.js';
import 'mobx-react/batchingForReactNative';
import messaging from '@react-native-firebase/messaging';
import firestore from '@react-native-firebase/firestore';
// import {
//   getIpAddress,
//   getDeviceName,
//   getManufacturer,
//   getDevice,
// } from 'react-native-device-info';
import {GoogleSignin} from '@react-native-community/google-signin';
import AsyncStorage from '@react-native-community/async-storage';
import SplashScreen from 'react-native-splash-screen';

const state = mobXState.create({
  movieBase: `https://api.themoviedb.org/3/movie/`,
  // movieBase2 : `https://api.themoviedb.org/3/movie/${param[/videos,/credits,/reviews,/similar]}?api_key=<<apiKey>>`,
  searchMovie: `https://api.themoviedb.org/3/search/movie?api_key=<<apiKey>>&query=<<movieName>>&page=<<pageNum>>`,
  genres: `https://api.themoviedb.org/4/discover/movie?api_key=<<apiKey>>&with_genres=<<genreId>>&language=en-US&sort_by=popularity.desc&page=<<pageNum>>`,
  year: `https://api.themoviedb.org/4/discover/movie?api_key=<<apiKey>>&year=<<year>>&language=en-US&sort_by=popularity.desc&page=<<pageNum>>`,
  upComing: `https://api.themoviedb.org/3/movie/upcoming?api_key=<<apiKey>>&language=en-US&page=<<pageNum>>`,
  popular: `https://api.themoviedb.org/3/movie/popular?api_key=<<apiKey>>&language=en-US&page=<<pageNum>>`,
  topRated: `https://api.themoviedb.org/3/movie/top_rated?api_key=<<apiKey>>&language=en-US&page=<<pageNum>>`,
  latest: `https://api.themoviedb.org/3/movie/latest?api_key=<<apiKey>>&language=en-US`,
  nowPlaying: `https://api.themoviedb.org/3/movie/now_playing?api_key=<<apiKey>>&language=en-US&page=1&region=<<ip>>`,
  trending: `https://api.themoviedb.org/3/trending/movie/day?api_key=<<apiKey>>`,
});

async function registerAppWithFCM() {
  await messaging().registerDeviceForRemoteMessages();

  const value = await AsyncStorage.getItem('notificationToken');
  if (value === null) {
    const notificationToken = await messaging().getToken();
    await AsyncStorage.setItem(
      'notificationToken',
      JSON.stringify(notificationToken),
    );
  }
}

const StoreProvider = () => {
  useEffect(() => {
    // SplashScreen.hide();
    registerAppWithFCM();
    GoogleSignin.configure({
      offlineAccess: true,
      webClientId:
        '183055357300-qfhrm17qdtbq2r9vv634aun7q2ev2cml.apps.googleusercontent.com',
    });
    return () => {
      // SplashScreen.show();
    };
  });

  return (
    <Provider store={state}>
      <App />
    </Provider>
  );
};

AppRegistry.registerComponent(appName, () => StoreProvider);
