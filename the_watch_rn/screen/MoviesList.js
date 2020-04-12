import React, {useEffect, Fragment, memo} from 'react';
import {View, FlatList, ActivityIndicator} from 'react-native';
import {inject, useLocalStore, useObserver} from 'mobx-react';
import {action} from 'mobx';
import Header from '../components/Header';
import MovieCardList from '../components/MovieCardList';
import Icon from 'react-native-vector-icons/Ionicons';

export const MoviesList = inject('store')(
  memo(({store, route, navigation}) => {
    const state = useLocalStore(() => ({
      movies: [],
      totalPages: 0,
      currentPage: 1,
      fetchedMore: false,
      change: action(obj => {
        for (let key in obj) {
          state[key] = obj[key];
        }
      }),
    }));

    useEffect(() => {
      store
        .useFetch(route.params.storeProperty, {
          pageNum: state.currentPage,
          ...route.params.urlParams,
        })
        .then(data => {
          state.change({
            movies: data.results,
            totalPages: data.total_pages,
          });
        })
        .catch(err => alert(`Opps! Error with fetch ${err}`));
    }, [state, route.params]);

    return useObserver(() => (
      <Fragment>
        <Header />

        <View style={{flex: 1, backgroundColor: '#333'}}>
          {state.movies.length < 1 ? (
            <View style={{flex: 1, justifyContent: 'center'}}>
              <ActivityIndicator size={100} color="rgb(110, 138, 146)" />
            </View>
          ) : (
            <Fragment>
              <FlatList
                data={state.movies}
                keyExtractor={item => item.id}
                renderItem={props => (
                  <MovieCardList
                    navigation={navigation}
                    dataLength={state.movies.length}
                    {...props}
                  />
                )}
                ItemSeparatorComponent={() => <View style={{height: 10}} />}
                contentContainerStyle={{padding: 10, paddingRight: 0}}
                numColumns={2}
                initialNumToRender={8}
                onEndReachedThreshold={0.1}
                onEndReached={() => {
                  if (state.currentPage !== state.totalPages) {
                    state.change({fetchedMore: true});
                    store
                      .useFetch(route.params.storeProperty, {
                        pageNum: state.currentPage + 1,
                        ...route.params.urlParams,
                      })
                      .then(data => {
                        state.change({
                          movies: state.movies.concat(data.results),
                          currentPage: state.currentPage + 1,
                          fetchedMore: false,
                        });
                      });
                  }
                }}
              />
              <View style>
                {state.fetchedMore && (
                  <ActivityIndicator size={40} color="rgb(110, 138, 146)" />
                )}
              </View>
            </Fragment>
          )}
        </View>
      </Fragment>
    ));
  }),
);
