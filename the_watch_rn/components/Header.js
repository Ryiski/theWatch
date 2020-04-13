import React, {useCallback} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation, useRoute} from '@react-navigation/native';

const Header = ({style, callBack, ...rest}) => {
  const navigation = useNavigation();
  const route = useRoute();

  return (
    <LinearGradient
      {...rest}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 0}}
      colors={['#1e343b', '#345a67', '#030322']}
      style={{maxHeight: 55, width: '100%', flexDirection: 'row', ...style}}>
      {route.name != 'Home' && (
        <View style={buttonContainer}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
              if (callBack) {
                callBack();
              }
            }}
            style={back}>
            <Icon size={40} name="md-arrow-round-back" color="#6c757d" />
          </TouchableOpacity>
        </View>
      )}

      <View style={buttonContainer}>
        <TouchableOpacity
          onPress={() => navigation.toggleDrawer()}
          style={menu}>
          <Icon size={25} name="md-menu" color="#6c757d" />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const {buttonContainer, menu, back} = StyleSheet.create({
  buttonContainer: {
    padding: 10,
    justifyContent: 'center',
    flex: 1,
  },
  menu: {
    alignSelf: 'flex-end',
    borderColor: '#6c757d',
    borderRadius: 10,
    borderWidth: 2,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  back: {
    alignSelf: 'flex-start',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
});

export default Header;
