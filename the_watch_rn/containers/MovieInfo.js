import React, {Fragment, useEffect} from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Linking,
  Dimensions,
} from 'react-native';
import {inject, observer, useLocalStore, useObserver} from 'mobx-react';
import {action} from 'mobx';
import LinearGradient from 'react-native-linear-gradient';
import Loading from '../components/Loading';
import Icon from 'react-native-vector-icons/Ionicons';
import IconFa from 'react-native-vector-icons/FontAwesome';
import {Viewport} from '@skele/components';
import InfoBlock from '../components/InfoBlock';

const ViewportAware = Viewport.Aware(View);

const MovieInfo = inject('store')(({store, route, fontSize}) => {
  const gradientColors = [
    'rgba(0,0,0,0)',
    'rgba(0,0,0,0)',
    'rgba(51, 51, 51, .3)',
    'rgba(51, 51, 51, .4)',
    'rgba(51, 51, 51, 1)',
  ];

  const {
    movieTitle,
    loaderContainer,
    movieImg,
    movieImgBlur,
    infoContainer,
    overviewContainer,
    overviewText,
    absolute,
    cantSeeButton,
  } = style;

  const windowInfo = () => {
    const dim = Dimensions.get('screen');
    return {
      orientation: dim.height >= dim.width ? 'portrait' : 'landscape',
      height: dim.height,
      width: dim.width,
    };
  };

  const state = useLocalStore(() => ({
    movieInfo: null,
    loading: true,
    isCantSee: false,
    isFirstRenderDone: false,
    YT_trailer: null,
    isWatchAble: store.watchMode,
    screenInfo: windowInfo(),
    change: action(obj => {
      for (let key in obj) {
        state[key] = obj[key];
      }
    }),
  }));

  useEffect(() => {
    if (state.isFirstRenderDone) {
      state.change({loading: true});
      fetchForComponent({loading: false});
    }
  }, [store.getMovie, route.params, state]);

  const fetchForComponent = stateObject => {
    store
      .getMovie(route.params.movieId)
      .then(data => state.change({movieInfo: data, ...stateObject}))
      .catch(err => console.log(err));

    store
      .getMovie(route.params.movieId, '/videos')
      .then(data =>
        data.results.length > 0
          ? state.change({YT_trailer: data.results[0].key})
          : state.change({YT_trailer: null}),
      )
      .catch(err => console.log(err));
  };

  return useObserver(() => (
    <ViewportAware
      onViewportEnter={() =>
        state.loading && !state.isFirstRenderDone
          ? fetchForComponent({loading: false, isFirstRenderDone: true})
          : null
      }>
      <View
        style={{
          height:
            state.screenInfo.height -
            (state.screenInfo.height < 500 ? 100 : 200),
        }}>
        <Text
          style={{
            ...movieTitle,
            backgroundColor: `rgba(0, 0, 0, ${state.isCantSee ? '.7' : '.1'})`,
            fontSize: fontSize.fontSize * 1.5,
          }}>
          {state.movieInfo?.title}
        </Text>

        <Loading size={100} style={absolute} />
        <LinearGradient
          style={{flex: 1, zIndex: 5, ...absolute}}
          colors={gradientColors}
        />

        {!state.loading && (
          <Image
            blurRadius={1}
            style={{
              ...movieImgBlur,
              ...absolute,
              backgroundColor: state.movieInfo.backdrop_path ? '#000' : '#eee',
            }}
            source={{
              uri: `https://image.tmdb.org/t/p/w500/${
                state.movieInfo.backdrop_path
              }`,
            }}
          />
        )}

        <View
          style={{
            zIndex: 5,
            flex: 1,
            flexDirection:
              state.screenInfo.orientation === 'landscape' ? 'row' : 'column',
          }}>
          <View style={{position: 'relative', flex: 1}}>
            {!state.loading && (
              <>
                <Loading size={100} style={absolute} />
                <Image
                  style={{...movieImg, ...absolute}}
                  source={
                    state.movieInfo.poster_path
                      ? {
                          uri: `https://image.tmdb.org/t/p/w500/${
                            state.movieInfo.poster_path
                          }`,
                        }
                      : require('../assets/images/placeholder.jpg')
                  }
                />
              </>
            )}
          </View>
          <View
            style={{
              ...overviewContainer,
              alignItems: 'stretch',
              justifyContent: 'flex-end',
            }}>
            {!state.loading && (
              <View
                style={{
                  flex: 1,
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                }}>
                <TouchableOpacity
                  style={cantSeeButton}
                  onPress={() => state.change({isCantSee: !state.isCantSee})}>
                  <Icon
                    size={25}
                    name={state.isCantSee ? 'ios-eye-off' : 'ios-eye'}
                    color="black"
                  />
                </TouchableOpacity>

                <ScrollView
                  style={{maxHeight: 150}}
                  nestedScrollEnabled={true}
                  scrollEnabled={true}
                  contentContainerStyle={{}}>
                  <Text
                    style={{
                      ...fontSize,
                      ...overviewText,
                      backgroundColor: `rgba(0,0,0,${
                        state.isCantSee ? '.7' : '.1'
                      })`,
                    }}>
                    {state.movieInfo.overview}
                  </Text>
                </ScrollView>
              </View>
            )}
          </View>
        </View>
      </View>
      <View style={infoContainer}>
        {state.movieInfo && !state.loading && (
          <InfoBlock
            store={store}
            fontSize={fontSize}
            isWatchAble={state.isWatchAble}
            movieId={route.params.movieId}
            movieInfo={{...state.movieInfo, trailer: state.YT_trailer}}
          />
        )}
      </View>
    </ViewportAware>
  ));
});

const style = StyleSheet.create({
  infoContainer: {flex: 1, flexDirection: 'row', height: 80},
  movieImg: {
    flex: 1,
    height: null,
    width: null,
    margin: 10,
    resizeMode: 'contain',
  },
  movieImgBlur: {
    height: null,
    width: null,
    flex: 1,
    resizeMode: 'cover',
    zIndex: 2,
  },
  movieTitle: {
    zIndex: 5,
    textAlignVertical: 'center',
    textAlign: 'center',
    color: '#fff',
  },
  overviewContainer: {position: 'relative', flex: 1, minWidth: 350},
  overviewText: {padding: 10, color: '#fff', flex: 1},
  absolute: {top: 0, left: 0, right: 0, bottom: 0, position: 'absolute'},
  cantSeeButton: {
    padding: 5,
    backgroundColor: 'rgba(225,225,225,.1)',
    alignSelf: 'flex-end',
  },
});

export default MovieInfo;

//299536
//https://image.tmdb.org/t/p/original//7WsyChQLEftFiDOVTGkv3hFpyyt.jpg
//https://www.youtube.com/embed/6ZfuNTqbHE8
