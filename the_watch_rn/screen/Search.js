import React, {useRef} from 'react';
import {action} from 'mobx';
import {useLocalStore, useObserver} from 'mobx-react';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {View} from 'react-native';
import SearchList from '../containers/SearchList';
import SearchInput from '../components/SearchInput';
import Header from '../components/Header';

export const Search = () => {
  let fontSize = {fontSize: RFPercentage(2)};

  const state = useLocalStore(() => ({
    search: '',
    movies: [],
    loading: false,
    fontSize: RFPercentage(2),
    change: action(obj => {
      for (let key in obj) {
        state[key] = obj[key];
      }
    }),
  }));

  const searchButton = useRef(null);

  return useObserver(() => (
    <View style={{backgroundColor: '#C5C3C3', flex: 1}}>
      <Header />
      <SearchInput searchButtonRef={searchButton} state={state} />
      <SearchList
        searchButtonRef={searchButton}
        state={state}
        fontSize={fontSize}
      />
    </View>
  ));
};
