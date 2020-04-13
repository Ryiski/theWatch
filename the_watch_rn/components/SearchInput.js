import React from 'react';
import Icons from 'react-native-vector-icons/FontAwesome';
import {useObserver} from 'mobx-react';
import {StyleSheet, TouchableOpacity, TextInput, View} from 'react-native';

export default ({state, onSearch}) => {
  return useObserver(() => (
    <View style={{...style.inputContainer}}>
      <TextInput
        style={{flex: 1, backgroundColor: '#eee'}}
        value={state.search}
        placeholder="Search..."
        onChangeText={text => {
          if (text === '') {
            state.change({movies: []});
          }
          state.change({search: text});
        }}
      />
      <TouchableOpacity
        style={style.Touchable}
        onPress={() => state.search != '' && onSearch()}>
        <Icons name="search" size={25} borderRadius={0} />
      </TouchableOpacity>
    </View>
  ));
};

const style = StyleSheet.create({
  Touchable: {
    padding: 10,
    justifyContent: 'center',
    backgroundColor: 'rgb(185, 115, 67)',
  },
  inputContainer: {
    flexDirection: 'row',
    borderRadius: 10,
    margin: 10,
    overflow: 'hidden',
  },
});
