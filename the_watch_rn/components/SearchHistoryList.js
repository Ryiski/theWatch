import React, {Fragment} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';

export default ({state, text, index, setHistory, onSearch}) => {
  return (
    <Fragment>
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: 20,
        }}>
        <TouchableWithoutFeedback
          onPress={() => {
            state.change({search: text});
            onSearch();
          }}>
          <Text
            style={{
              flex: 1,
              fontSize: 20,
            }}>
            {text}
          </Text>
        </TouchableWithoutFeedback>
        <TouchableOpacity
          style={{justifyContent: 'center'}}
          onPress={async () => {
            const value = await AsyncStorage.getItem('searchHistory');
            let parsedValue = JSON.parse(value);
            parsedValue.splice(index, 1);
            setHistory(parsedValue);
            await AsyncStorage.setItem(
              'searchHistory',
              JSON.stringify(parsedValue),
            );
          }}>
          <Icon name="md-close-circle" color="#333" size={20} />
        </TouchableOpacity>
      </View>
      <View style={[hr]} />
    </Fragment>
  );
};

const {hr} = StyleSheet.create({
  hr: {
    marginBottom: 5,
    marginTop: 5,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
  },
});
