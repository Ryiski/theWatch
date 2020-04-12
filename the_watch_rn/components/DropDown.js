import React, {Fragment, useEffect, useState} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {inject} from 'mobx-react';

const DropDown = inject('store')(
  ({store, items, name, iconName, navigation}) => {
    const fontsize = RFPercentage(2);

    const [dropDownState, setState] = useState({
      isOpen: false,
      animationValue: new Animated.Value(65),
      maxHeight: null,
    });

    useEffect(() => {
      Animated.timing(dropDownState.animationValue, {
        toValue: dropDownState.isOpen ? dropDownState.maxHeight : 65,
        duration: 100,
        easing: Easing.in,
        useNativeDriver: false,
      }).start();
    }, [dropDownState]);

    const _setMaxHeight = e => {
      e.persist();
      setState(({...prev}) => ({
        ...prev,
        maxHeight: e.nativeEvent.layout.height + 65,
      }));
    };

    return (
      <Fragment>
        <Animated.View
          style={{overflow: 'hidden', height: dropDownState.animationValue}}>
          <View style={dropDownButtonContainer}>
            <TouchableOpacity
              onPress={() =>
                setState(({...prev}) => ({...prev, isOpen: !prev.isOpen}))
              }
              style={dropDownButton}>
              <Text style={{...dropDownButtonText, fontSize: fontsize}}>
                {' '}
                {name}{' '}
              </Text>
              <Icon color="#6c757d" name={iconName} size={20} />
              <View style={{flex: 1, alignItems: 'flex-end'}}>
                <Icon
                  color="rgb(185, 115, 67)"
                  name={`md-arrow-${
                    dropDownState.isOpen ? 'dropup' : 'dropdown'
                  }`}
                  size={20}
                />
              </View>
            </TouchableOpacity>
          </View>

          <View onLayout={_setMaxHeight} style={dropDownItemsContainer}>
            {items.map((item, i) => (
              <TouchableOpacity
                onPress={() => {
                  const urlParams =
                    typeof item === 'object'
                      ? {genreId: item.id}
                      : {year: item};
                  const storeMethod =
                    typeof item === 'object' ? 'genres' : 'year';
                  navigation.navigate('MoviesList', {
                    storeProperty: storeMethod,
                    urlParams,
                  });
                }}
                style={dropDownItemsStyle}
                key={i}>
                <Text
                  style={{
                    ...dropDownButtonText,
                    fontSize: Math.floor(fontsize / 1.2),
                  }}>
                  {' '}
                  {typeof item === 'object' ? item.name : item}{' '}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      </Fragment>
    );
  },
);

const {
  dropDownButton,
  dropDownButtonText,
  dropDownItemsStyle,
  dropDownItemsContainer,
  dropDownButtonContainer,
} = StyleSheet.create({
  dropDownButtonContainer: {
    borderBottomWidth: 1,
    padding: 10,
    minHeight: 65,
  },
  dropDownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dropDownButtonText: {
    marginRight: 20,
    marginLeft: 10,
    color: '#fff',
  },
  dropDownItemsStyle: {
    padding: 7,
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
  },
  dropDownItemsContainer: {
    backgroundColor: 'lightgrey',
  },
});

export default DropDown;
