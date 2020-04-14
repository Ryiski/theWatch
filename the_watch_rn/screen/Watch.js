import React, {useEffect, useState} from 'react';
import {useLocalStore, useObserver} from 'mobx-react';
import {inject} from 'mobx-react';
import {WebView} from 'react-native-webview';
import {View, Linking} from 'react-native';
import Orientation from 'react-native-orientation';

export const Watch = inject('store')(({store, route}) => {
  // const state = useLocalStore(() => ({}));

  // useEffect(() => {
  //   Orientation.unlockAllOrientations();
  //   Orientation.lockToLandscape();

  //   return () => {
  //     Orientation.lockToPortrait();
  //   };
  // }, [route]);

  const [movieLink, setMovieLink] = useState(null);

  useEffect(() => {
    store
      .getMovieLink(route.params.movieId)
      .then(data =>
        Linking.openURL(data).catch(err =>
          console.error('An error occurred', err),
        ),
      );
  }, [route]);

  return useObserver(() => (
    <View style={{flex: 1, backgroundColor: '#000'}}>
      {/* <WebView
        originWhitelist={[]}
        source={{
          uri:
            'https://streamwatching.today/v/HIqoHGVlc8AgEUQGZbO3KKua7XDWDFN5AjbcWrdE6TErimeWwV2yThSmNemc',
        }}
      /> */}
    </View>
  ));
});
