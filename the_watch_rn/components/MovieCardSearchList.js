import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import CustomText from './CustomText';
import {genres} from '../genres';

const getGenres = genresId => {
  let arr = [];
  if (genresId.length >= 1) {
    genres.forEach(gen => {
      genresId.filter(id => {
        if (id === gen.id) {
          arr.push({
            id: gen.id,
            name: gen.name,
          });
        }
      });
    });
  } else {
    arr.push({name: 'unknown'});
  }
  return arr;
};

export default (MovieCardHomeList = ({
  isLastElement,
  title,
  releaseDate,
  rating,
  imgUrl,
  id,
  genresIds,
}) => {
  const navigation = useNavigation();

  const {container, img, hr, shadow} = style;

  const _onPress = () => {
    navigation.navigate('MovieDetails', {movieId: id});
  };

  const MovieGenres = getGenres(genresIds)
    .map(genre => genre.name)
    .join(', ');

  return (
    <TouchableOpacity onPress={_onPress}>
      <View style={container}>
        <Image
          style={img}
          source={
            imgUrl
              ? {uri: `https://image.tmdb.org/t/p/w342//${imgUrl}`}
              : require('../assets/images/noimage.png')
          }
        />

        <View style={{flex: 3}}>
          <CustomText
            text="Title: "
            style={{color: 'rgb(143, 70, 70)'}}
            child={<CustomText text={title} style={{color: '#000'}} />}
          />
          <CustomText
            text="IMDb: "
            style={{color: 'rgb(143, 70, 70)'}}
            child={<CustomText text={rating} style={{color: '#000'}} />}
          />
          <CustomText
            text="Release: "
            style={{color: 'rgb(143, 70, 70)'}}
            child={<CustomText text={releaseDate} style={{color: '#000'}} />}
          />
          <CustomText
            text="Genres: "
            style={{color: 'rgb(143, 70, 70)'}}
            child={<CustomText text={MovieGenres} style={{color: '#000'}} />}
          />
        </View>
      </View>
      {!isLastElement ? <View style={[hr, shadow]} /> : null}
    </TouchableOpacity>
  );
});

const style = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
    padding: 10,
  },
  img: {
    height: null,
    width: null,
    minHeight: 200,
    minWidth: 100,
    flex: 1,
    resizeMode: 'contain',
  },
  hr: {
    marginBottom: 5,
    marginTop: 5,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 24,
  },
});
