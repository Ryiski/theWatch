import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Loading from './Loading';
import LinearGradient from 'react-native-linear-gradient';

const MovieCard = ({
  fontSize,
  title,
  imgPath,
  id,
  scroll: {parentScroll, similarMovieScroll},
}) => {
  const navigation = useNavigation();
  const {bgImg, movieTitle} = style;

  const _onPress = () => {
    parentScroll.current.scrollTo({y: 0});
    similarMovieScroll.current.scrollToIndex({index: 0});
    navigation.setParams({movieId: id});
  };

  return (
    <TouchableOpacity
      onPress={_onPress}
      style={{marginRight: 15, minHeight: 400, width: 260}}>
      <View style={{position: 'relative', flex: 1}}>
        <Image
          style={bgImg}
          source={
            imgPath
              ? {uri: `https://image.tmdb.org/t/p/w342/${imgPath}`}
              : require('../assets/images/noimage.png')
          }
        />
        <Loading
          size={45}
          style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}
        />
        <LinearGradient
          style={{
            flex: 1,
            zIndex: 5,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            position: 'absolute',
          }}
          colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0)', 'rgba(0, 0, 0, 1)']}>
          <Text style={[{...fontSize}, movieTitle]}>{title}</Text>
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );
};

const style = StyleSheet.create({
  bgImg: {
    height: null,
    width: null,
    flex: 1,
    resizeMode: 'contain',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  movieTitle: {
    flex: 1,
    color: '#eee',
    textAlignVertical: 'bottom',
    textAlign: 'center',
    zIndex: 1,
  },
});

export default MovieCard;
