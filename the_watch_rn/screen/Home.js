import React, {Fragment, useState, useEffect} from 'react';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import Header from '../components/Header';
import {Viewport} from '@skele/components';
import HomeMovieList from '../components/HomeMovieList';
import LinearGradient from 'react-native-linear-gradient';
import {ScrollView} from 'react-native-gesture-handler';
import {inject} from 'mobx-react';
import Icon from 'react-native-vector-icons/Ionicons';
import IconFa from 'react-native-vector-icons/FontAwesome';
import IconMc from 'react-native-vector-icons/MaterialCommunityIcons';
import {MovieCard} from '../components/HomeMovieList';
import Loading from '../components/Loading';
const ViewportAware = Viewport.Aware(View);

export const Home = inject('store')(({store, navigation}) => {
  let fontSize = {fontSize: RFPercentage(2)};

  const windowInfo = () => {
    const dim = Dimensions.get('screen');
    return {
      orientation: dim.height >= dim.width ? 'portrait' : 'landscape',
      height: dim.height - 150,
      width: dim.width,
    };
  };

  const sections = [
    {
      title: 'Popular Movies',
      storeProperty: 'popular',
    },
    {
      title: 'Upcoming Movies',
      storeProperty: 'upComing',
    },
    {
      title: 'TopRated Movies',
      storeProperty: 'topRated',
    },
  ];

  const [trending, setTrending] = useState([]);
  const [nowPlaying, setNowPlaying] = useState([]);

  useEffect(() => {
    store.nowPlaying().then(data => setNowPlaying(data.results));
  }, [store]);

  const [sliderSize] = useState(windowInfo());

  const gradientColors = [
    'rgba(0,0,0,0)',
    'rgba(0,0,0,0)',
    'rgba(51, 51, 51, .3)',
    'rgba(51, 51, 51, .4)',
    'rgba(51, 51, 51, 1)',
  ];

  return (
    <View style={container}>
      <Header />
      <Viewport.Tracker>
        <ScrollView
          removeClippedSubviews={true}
          showsVerticalScrollIndicator={false}>
          <ViewportAware
            onViewportEnter={() =>
              trending.length < 1 &&
              store.useFetch('trending').then(data => setTrending(data.results))
            }
            style={{
              backgroundColor: '#000',
              position: 'relative',
              minHeight:
                sliderSize.height > sliderSize.width && sliderSize.height < 500
                  ? 600
                  : sliderSize.height,
            }}>
            <LinearGradient
              style={{flex: 1, zIndex: 0, ...absolute}}
              colors={gradientColors}>
              <Loading size={100} />
            </LinearGradient>

            <FlatList
              style={{zIndex: 6}}
              data={trending}
              keyExtractor={item => `${item.id}`}
              horizontal={true}
              removeClippedSubviews={true}
              maxToRenderPerBatch={2}
              initialNumToRender={4}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{position: 'relative'}}
              renderItem={({
                item: {
                  id,
                  backdrop_path,
                  poster_path,
                  title,
                  vote_average,
                  release_date,
                },
              }) => {
                return (
                  <TouchableWithoutFeedback
                    onPress={() =>
                      navigation.navigate('MovieDetails', {movieId: id})
                    }>
                    <View
                      style={{
                        position: 'relative',
                        minWidth: sliderSize.width,
                        backgroundColor: null,
                      }}>
                      <LinearGradient
                        style={{flex: 1, zIndex: 1, ...absolute}}
                        colors={gradientColors}>
                        <View
                          style={{
                            flex: 1,
                            padding: 10,
                            justifyContent: 'flex-end',
                          }}>
                          {[
                            {
                              info: title.toUpperCase(),
                              iconName: 'movie-roll',
                              IconComponent: IconMc,
                              IconColor: 'rgb(143, 70, 70)',
                            },

                            {
                              info: release_date.replace(
                                /(\d+)-(\d+)-(\d+)/,
                                '$3/$2/$1',
                              ),
                              iconName: 'md-calendar',
                              IconComponent: Icon,
                              IconColor: 'rgb(143, 70, 70)',
                            },
                            {
                              info: `${vote_average} / 10`,
                              iconName: 'imdb',
                              IconComponent: IconFa,
                              IconColor: 'rgb(255, 230, 0)',
                            },
                          ].map(
                            ({info, iconName, IconComponent, IconColor}, i) => (
                              <View
                                key={id + i}
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  marginBottom: 10,
                                }}>
                                <IconComponent
                                  name={iconName}
                                  size={30}
                                  color={IconColor}
                                />
                                <Text style={{...sliderText, ...fontSize}}>
                                  {info}
                                </Text>
                              </View>
                            ),
                          )}
                        </View>
                      </LinearGradient>

                      <Image
                        style={{...movieImg}}
                        source={{
                          uri: `https://image.tmdb.org/t/p/w500/${
                            sliderSize.orientation === 'portrait'
                              ? poster_path
                              : backdrop_path
                          }`,
                        }}
                      />
                    </View>
                  </TouchableWithoutFeedback>
                );
              }}
            />
          </ViewportAware>
          {sections.map(({title, storeProperty}, i) => (
            <Fragment key={i}>
              <HomeMovieList title={title} storeProperty={storeProperty} />
            </Fragment>
          ))}
          {nowPlaying.length > 0 && (
            <View style={{minHeight: 350}}>
              <View style={headerList}>
                <Text style={headerListText}>Now Playing In Local Cinema</Text>
                <View style={hr} />
              </View>
              <FlatList
                style={{paddingHorizontal: 10, paddingVertical: 5}}
                data={nowPlaying}
                keyExtractor={item => `${item.id}`}
                horizontal={true}
                extraData={nowPlaying}
                removeClippedSubviews={true}
                maxToRenderPerBatch={2}
                initialNumToRender={6}
                showsHorizontalScrollIndicator={false}
                renderItem={props => (
                  <MovieCard {...props} navigation={navigation} />
                )}
              />
            </View>
          )}
        </ScrollView>
      </Viewport.Tracker>
    </View>
  );
});

const {
  container,
  headerList,
  headerListText,
  hr,
  absolute,
  movieImg,
  sliderText,
} = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333',
  },
  absolute: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    position: 'absolute',
  },
  movieImg: {
    height: null,
    width: null,
    flex: 1,
    resizeMode: 'cover',
    // zIndex: 2,
  },
  sliderText: {
    textDecorationStyle: 'solid',
    fontWeight: 'bold',
    color: '#eee',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -5, height: 5},
    textShadowRadius: 10,
    textDecorationColor: '#000',
    marginLeft: 10,
  },
  headerList: {
    paddingHorizontal: 5,
  },
  headerListText: {
    fontSize: RFPercentage(2),
    color: '#eee',
    paddingLeft: 8,
    marginTop: 10,
  },
  hr: {
    marginTop: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});
