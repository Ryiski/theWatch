/**
 * @format
 */
import 'react-native-get-random-values';
import React from 'react';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {Provider} from 'mobx-react';
import store from './mobxStore.js';
import 'mobx-react/batchingForReactNative';

const state = store.create({
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

const StoreProvider = () => (
  <Provider store={state}>
    <App />
  </Provider>
);

AppRegistry.registerComponent(appName, () => StoreProvider);
