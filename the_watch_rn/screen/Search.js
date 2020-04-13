import React, {useRef} from 'react';
import {action} from 'mobx';
import {useLocalStore, useObserver} from 'mobx-react';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {View} from 'react-native';
import {inject} from 'mobx-react';
import SearchList from '../containers/SearchList';
import SearchInput from '../components/SearchInput';
import Header from '../components/Header';
import AsyncStorage from '@react-native-community/async-storage';

export const Search = inject('store')(({store}) => {
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

  const _onSearch = () => {
    state.change({loading: true});

    store
      .useFetch('searchMovie', {
        movieName: state.search,
        pageNum: 1,
      })
      .then(res =>
        state.change({
          movies: res.results,
          loading: false,
        }),
      )
      .catch(err =>
        alert(`Opps!! Something went wrong, Please try again later`),
      )
      .finally(async () => {
        const value = await AsyncStorage.getItem('searchHistory');

        let parsedValue = JSON.parse(value);
        let newSearch = [state.search];
        if (value !== null) {
          if (parsedValue.includes(state.search)) {
            const itemIndex = parsedValue.indexOf(state.search);
            parsedValue.splice(itemIndex, 1);
          }
          newSearch.push(...parsedValue);
        }
        await AsyncStorage.setItem('searchHistory', JSON.stringify(newSearch));
      });
  };

  const _onBack = () => {
    state.change({
      search: '',
      movies: [],
      loading: false,
    });
  };

  return useObserver(() => (
    <View style={{backgroundColor: '#C5C3C3', flex: 1}}>
      <Header callBack={_onBack} />
      <SearchInput onSearch={_onSearch} state={state} />
      <SearchList onSearch={_onSearch} state={state} fontSize={fontSize} />
    </View>
  ));
});
