import React, {memo, useEffect, Fragment, useState} from 'react';
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import IconF from 'react-native-vector-icons/Feather';
import {DrawerContentScrollView} from '@react-navigation/drawer';
import {releases, genres} from './genres.js';
import {inject} from 'mobx-react';
import LinearGradient from 'react-native-linear-gradient';
import {RFPercentage} from 'react-native-responsive-fontsize';
import DropDown from './components/DropDown';
import AsyncStorage from '@react-native-community/async-storage';
import auth from '@react-native-firebase/auth';
import ImagePicker from 'react-native-image-picker';
import firestorage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';

const addImage = cb => {
  const options = {
    noData: true,
    title: 'Select Avatar',
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };

  ImagePicker.showImagePicker(options, async response => {
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.error) {
      alert(`Opps!! couldn't Select Image at the moment`);
    } else {
      const storage = await firestorage().ref(
        `users-profile-image/${auth().currentUser.displayName}-profile-pic`,
      );
      await storage.putFile(response.path);
      const imageUrl = await storage.getDownloadURL();
      console.log('addImage -> te', imageUrl);
      firestore()
        .collection('Users')
        .doc(auth().currentUser.uid)
        .update({
          profilePic: imageUrl,
        });

      cb(state => ({...state, profilePic: imageUrl}));
    }
  });
};

const SideMenu = inject('store')(
  memo(({navigation, store, ...rest}) => {
    const fontsize = RFPercentage(2);

    const [clicks, setClicks] = useState(0);
    const [user, setUser] = useState(null);

    const setWatchMode = async (store, clicks, setClicks) => {
      if (clicks < 5 && store.watchMode === false) {
        setClicks(state => state + 1);
      }

      if (clicks === 5 && store.watchMode === false) {
        await AsyncStorage.setItem('watchMode', JSON.stringify(true));
        store.change({
          watchMode: true,
        });
      }
    };

    const signOut = async () => {
      try {
        await auth().signOut();
        setUser(null);
      } catch (error) {
        console.error(error);
      }
    };

    useEffect(() => {
      if (auth().currentUser) {
        firestore()
          .collection('Users')
          .doc(auth().currentUser.uid)
          .get()
          .then(user => {
            setUser(user._data);
          });
      }
    }, [auth().currentUser]);
    return (
      <Fragment>
        <LinearGradient
          colors={['#1e343b', '#345a67', '#030322']}
          style={menuContainer}>
          <View style={{flex: 0.5, borderBottomWidth: 1}}>
            {user ? (
              <Fragment>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative',
                  }}>
                  <TouchableOpacity
                    onPress={() => addImage(setUser)}
                    style={{
                      position: 'absolute',
                      zIndex: 1,
                      top: 25,
                      right: 70,
                      borderRadius: 100,
                      backgroundColor: '#eee',
                    }}>
                    <IconF
                      name="plus-circle"
                      size={30}
                      color="rgb(185, 115, 67)"
                    />
                  </TouchableOpacity>

                  {user.profilePic ? (
                    <Image
                      style={{
                        flex: 1,
                        width: 150,
                        maxHeight: 150,
                        borderRadius: 100,
                        resizeMode: 'cover',
                      }}
                      source={{uri: user.profilePic}}
                    />
                  ) : (
                    <Text
                      style={{
                        width: 150,
                        maxHeight: 150,
                        borderRadius: 100,
                        backgroundColor: '#333',
                        flex: 1,
                        textAlign: 'center',
                        textAlignVertical: 'center',
                        color: '#eee',
                        fontSize: 50,
                        borderColor: '#000',
                        borderWidth: 1,
                      }}>
                      {auth().currentUser.displayName[0].toUpperCase()}
                    </Text>
                  )}
                </View>
                <TouchableOpacity
                  style={{
                    justifyContent: 'flex-end',
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingRight: 10,
                    paddingBottom: 10,
                  }}
                  onPress={signOut}>
                  <Text
                    style={{
                      color: 'rgb(185, 115, 67)',
                      textAlign: 'right',
                      paddingRight: 10,
                    }}>
                    Sign Out
                  </Text>
                  <Icon name="ios-log-out" size={15} color="#eee" />
                </TouchableOpacity>
              </Fragment>
            ) : (
              <View style={{flex: 1, transform: [{rotate: '45deg'}]}}>
                <TouchableWithoutFeedback
                  onPress={() =>
                    navigation.navigate('Auth', {screen: 'Login'})
                  }>
                  <Text
                    style={{
                      flex: 1,
                      textAlign: 'center',
                      textAlignVertical: 'bottom',
                      paddingBottom: 10,
                      color: '#eee',
                    }}>
                    Log In
                  </Text>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback
                  onPress={() =>
                    navigation.navigate('Auth', {screen: 'SignUp'})
                  }>
                  <Text
                    style={{
                      flex: 1,
                      textAlign: 'center',
                      textAlignVertical: 'top',
                      paddingTop: 10,
                      color: '#eee',
                    }}>
                    Sign Up
                  </Text>
                </TouchableWithoutFeedback>
              </View>
            )}
          </View>
          <DrawerContentScrollView>
            <View style={menuButtonContainer}>
              <TouchableOpacity
                style={menuButton}
                onPress={() => navigation.navigate('Search')}>
                <Text style={{...dropDownText, fontSize: fontsize}}>
                  Search
                </Text>
                <Icon
                  color="#6c757d"
                  name="md-search"
                  size={20}
                  borderRadius={0}
                />
              </TouchableOpacity>
            </View>

            <View style={menuButtonContainer}>
              <TouchableOpacity
                style={menuButton}
                onPress={() => navigation.navigate('Home')}>
                <Text style={{...dropDownText, fontSize: fontsize}}>Home</Text>
                <Icon
                  color="#6c757d"
                  name="md-home"
                  size={20}
                  borderRadius={0}
                />
              </TouchableOpacity>
            </View>

            <DropDown
              name="Releases"
              iconName="md-calendar"
              items={releases}
              navigation={navigation}
            />

            <DropDown
              name="Genres"
              iconName="md-film"
              items={genres}
              navigation={navigation}
            />
          </DrawerContentScrollView>
          <View
            style={{
              padding: 10,
              alignSelf: 'flex-end',
            }}>
            <TouchableWithoutFeedback
              onPress={() => {
                setWatchMode(store, clicks, setClicks);
              }}>
              <Image
                source={require('./assets/images/TMDB.png')}
                style={{
                  height: 60,
                  width: 60,
                  resizeMode: 'cover',
                  alignSelf: 'flex-end',
                }}
              />
            </TouchableWithoutFeedback>
          </View>
        </LinearGradient>
      </Fragment>
    );
  }),
);

const {
  menuContainer,
  menuButtonContainer,
  menuButton,
  dropDownText,
} = StyleSheet.create({
  menuContainer: {
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
    flex: 10,
  },
  menuButtonContainer: {
    borderBottomWidth: 1,
    minHeight: 65,
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    flex: 1,
  },
  dropDownText: {
    marginRight: 20,
    marginLeft: 15,
    color: '#fff',
  },
});

export default SideMenu;
