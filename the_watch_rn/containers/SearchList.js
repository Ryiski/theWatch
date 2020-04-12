import React, {useEffect, useState, Fragment} from 'react';
import {
  StyleSheet,
  FlatList,
  View,
  Text,
  TouchableWithoutFeedback,
} from 'react-native';
import {useObserver} from 'mobx-react';
import MovieCardSearchList from '../components/MovieCardSearchList';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import SearchHistoryList from '../components/SearchHistoryList';
import Loading from '../components/Loading';

const getSearchHistory = async () => {
  const value = await AsyncStorage.getItem('searchHistory');
  return value !== null ? JSON.parse(value) : [];
};

export default (SearchList = ({state, fontSize, searchButtonRef}) => {
  const navigation = useNavigation();

  const [history, setHistory] = useState([]);
  useEffect(() => {
    getSearchHistory().then(data => setHistory(data));
  }, []);

  return useObserver(() => (
    <View style={{...scrollContainer}}>
      {!state.loading && state.movies.length > 0 && state.search != '' ? (
        state.movies.length > 0 ? (
          <FlatList
            data={state.movies.slice(0, 5)}
            contentContainerStyle={{}}
            keyExtractor={item => `${item.id}`}
            renderItem={({item, index}) => {
              // console.log('default -> item', item);

              return (
                <MovieCardSearchList
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  releaseDate={item.release_date}
                  rating={item.vote_average}
                  imgUrl={item.poster_path}
                  isLastElement={index === 4}
                  genresIds={item.genre_ids}
                />
              );
            }}
            ListFooterComponent={() =>
              state.movies.length > 5 && (
                <TouchableWithoutFeedback
                  onPress={() => {
                    navigation.navigate('MoviesList', {
                      storeProperty: 'searchMovie',
                      urlParams: {
                        movieName: state.search,
                      },
                    });
                  }}>
                  <Text
                    style={{
                      // backgroundColor:'#eee',
                      color: 'rgb(185, 115, 67)',
                      textAlign: 'center',
                      fontSize: 20,
                    }}>
                    Show All
                  </Text>
                </TouchableWithoutFeedback>
              )
            }
          />
        ) : (
          <Text style={[...fontSize, noResults]}>No Results</Text>
        )
      ) : (
        <View style={{flex: 1, justifyContent: 'center'}}>
          {state.loading ? (
            <Loading size={20} />
          ) : (
            <View
              style={{
                flex: 1,
              }}>
              {history.map((searched, i) => (
                <SearchHistoryList
                  text={searched}
                  searchButtonRef={searchButtonRef}
                  state={state}
                  index={i}
                  key={searched + i}
                  setHistory={setHistory}
                />
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  ));
});

const {scrollContainer, noResults} = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#C5C3C3',
    alignSelf: 'stretch',
  },
  noResults: {
    textAlign: 'center',
    flex: 1,
    textAlignVertical: 'center',
  },
});
