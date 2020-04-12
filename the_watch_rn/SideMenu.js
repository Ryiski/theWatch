import React, { memo, Fragment } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { releases, genres } from './genres.js'
import { inject } from 'mobx-react';
import LinearGradient from 'react-native-linear-gradient';
import { RFPercentage } from 'react-native-responsive-fontsize'
import DropDown from './components/DropDown';

const SideMenu = inject('store')(memo(({ navigation, store, ...rest }) => {

  const fontsize = RFPercentage(2)

  return (
    <Fragment>
      <LinearGradient colors={['#1e343b', '#345a67', '#030322',]} style={menuContainer}>
        <DrawerContentScrollView >

          <View style={menuButtonContainer}>
            <TouchableOpacity style={menuButton} onPress={()=> navigation.navigate('Search')}>
              <Text style={{ ...dropDownText, fontSize: fontsize }}>Search</Text>
              <Icon color='#6c757d' name="md-search" size={20} borderRadius={0} />
            </TouchableOpacity>
          </View>

          <View style={menuButtonContainer}>
            <TouchableOpacity style={menuButton} onPress={()=> navigation.navigate('Home')}>
              <Text style={{ ...dropDownText, fontSize: fontsize }}>Home</Text>
              <Icon color='#6c757d' name="md-home" size={20} borderRadius={0} />
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
        <View style={{ padding: 10 }}>
          <Image
            source={require('./assets/images/TMDB.png')}
            style={{ height: 60, width: 60, resizeMode: 'cover', alignSelf: 'flex-end' }} />
        </View>
      </LinearGradient>
    </Fragment>
  );
}))

const { 
  menuContainer, 
  menuButtonContainer, 
  menuButton, 
  dropDownText 
} = StyleSheet.create({
  menuContainer: {
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
    flex: 10,
  },
  menuButtonContainer: {
    borderBottomWidth: 1,
    minHeight: 65
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    flex: 1
  },
  dropDownText: {
    marginRight: 20,
    marginLeft: 15,
    color: '#fff',

  }
});

export default SideMenu