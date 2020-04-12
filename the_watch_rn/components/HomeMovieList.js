import React, {useState, Fragment} from 'react';
import {inject} from 'mobx-react';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {Viewport} from '@skele/components';
import LinearGradient from 'react-native-linear-gradient';
import Loading from '../components/Loading';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';

const ViewportAware = Viewport.Aware(View);

const MovieCard = ({item: {title, poster_path, id}, navigation}) => (
  <TouchableOpacity
    style={{marginRight: 15, flex: 1}}
    onPress={() => navigation.navigate('MovieDetails', {movieId: id})}>
    <View style={{position: 'relative', flex: 1, height: 300, width: 200}}>
      <Image
        style={bgImg}
        source={{uri: `https://image.tmdb.org/t/p/w342/${poster_path}`}}
      />
      <Loading size={45} style={absolute} />
      <LinearGradient
        style={{flex: 1, zIndex: 5, ...absolute}}
        colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0)', 'rgba(0, 0, 0, .8)']}>
        <Text style={movieTitle}>{title}</Text>
      </LinearGradient>
    </View>
  </TouchableOpacity>
);

const SeeMore = ({navigation, storeProperty}) => (
  <View
    style={{flex: 1, width: 100, justifyContent: 'center', marginRight: 15}}>
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('MoviesList', {
          storeProperty: storeProperty,
          storeMethodArgument: {},
        });
      }}
      style={{alignSelf: 'center', alignItems: 'center'}}>
      <Icon
        name="md-arrow-dropright-circle"
        size={50}
        color="rgb(185, 115, 67)"
      />
      <Text style={{fontSize: 20, color: '#eee', textAlign: 'center'}}>
        See All
      </Text>
    </TouchableOpacity>
  </View>
);

export default inject('store')(({store, storeProperty, title}) => {
  const navigation = useNavigation();

  const [list, setList] = useState([]);

  return (
    <ViewportAware
      onViewportEnter={() =>
        list.length < 1 &&
        store
          .useFetch(storeProperty, {
            pageNum: 1,
          })
          .then(data => setList(data.results))
      }
      style={{minHeight: 350}}>
      {list.length < 1 ? (
        <Loading size={100} />
      ) : (
        <Fragment>
          <View style={headerList}>
            <Text style={headerListText}>{title}</Text>
            <View style={hr} />
          </View>
          <FlatList
            style={{paddingHorizontal: 10, paddingVertical: 5}}
            data={list}
            keyExtractor={item => `${item.id}`}
            horizontal={true}
            extraData={list}
            removeClippedSubviews={true}
            maxToRenderPerBatch={2}
            initialNumToRender={6}
            showsHorizontalScrollIndicator={false}
            renderItem={props => (
              <MovieCard {...props} navigation={navigation} />
            )}
            ListFooterComponent={props =>
              list.length > 0 ? (
                <SeeMore
                  {...props}
                  storeProperty={storeProperty}
                  navigation={navigation}
                />
              ) : null
            }
          />
        </Fragment>
      )}
    </ViewportAware>
  );
});

const {
  absolute,
  bgImg,
  movieTitle,
  headerList,
  headerListText,
  hr,
} = StyleSheet.create({
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bgImg: {
    flex: 1,
    resizeMode: 'cover',
    zIndex: 1,
  },
  movieTitle: {
    flex: 1,
    color: '#eee',
    textAlignVertical: 'bottom',
    textAlign: 'center',
    padding: 5,
    fontSize: RFPercentage(2),
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

export {MovieCard};
