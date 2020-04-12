import React, {useEffect, useState} from 'react';
import Icons from 'react-native-vector-icons/FontAwesome';
import {useObserver, inject} from 'mobx-react';
import {StyleSheet, TouchableOpacity, TextInput, View} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

export default (SearchInput = inject('store')(
  ({store, state, searchButtonRef}) => {
    const _onPress = () => {
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
          await AsyncStorage.setItem(
            'searchHistory',
            JSON.stringify(newSearch),
          );
        });
    };

    return useObserver(() => (
      <View style={{...style.inputContainer}}>
        <TextInput
          style={{flex: 1, backgroundColor: '#eee'}}
          value={state.search}
          placeholder="Search..."
          onChangeText={text => {
            if (text === '') {
              state.change({movies: []});
            }
            state.change({search: text});
          }}
        />
        <TouchableOpacity
          ref={searchButtonRef}
          style={style.Touchable}
          onPress={() => state.search != '' && _onPress()}>
          <Icons name="search" size={25} borderRadius={0} />
        </TouchableOpacity>
      </View>
    ));
  },
));

const style = StyleSheet.create({
  Touchable: {
    padding: 10,
    justifyContent: 'center',
    backgroundColor: 'rgb(185, 115, 67)',
  },
  inputContainer: {
    flexDirection: 'row',
    borderRadius: 10,
    margin: 10,
    overflow: 'hidden',
  },
});
