import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {
  GoogleSigninButton,
  GoogleSignin,
  statusCodes,
} from '@react-native-community/google-signin';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-community/async-storage';

import LinearGradient from 'react-native-linear-gradient';
import {createStackNavigator} from '@react-navigation/stack';
import {Login} from './Login';
import {SignUp} from './SignUp';
const Stack = createStackNavigator();

const googleSignIn = async () => {
  // // await GoogleSignin.revokeAccess();
  // await GoogleSignin.signOut();

  try {
    const {idToken} = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    //Sign-in the user with the credential
    await auth().signInWithCredential(googleCredential);

    // const notificationToken = await AsyncStorage.getItem('notificationToken');
    // firestore()
    //   .collection('Users')
    //   .add({
    //     formOfSignUp: 'google',
    //     displayName,
    //     email,
    //     password: null,
    //     phoneNumber,
    //     photoURL,
    //     notificationToken: JSON.parse(notificationToken),
    //   })
    //   .then(() => {
    //     console.log('User added!');
    //   });
  } catch (error) {
    alert('Opps!! a Unknown error occurred, Try log in at a later time');
  }
};

// const googleSingIn = () => {
//   // auth()
//   //   .createUserWithEmailAndPassword(
//   //     'sarah.lane@gmail.com',
//   //     'SuperSecretPassword!',
//   //   )
//   //   .then(() => {
//   //     console.log('User account created & signed in!');
//   //   })
//   //   .catch(error => {
//   //     if (error.code === 'auth/email-already-in-use') {
//   //       console.log('That email address is already in use!');
//   //     }
//   //     if (error.code === 'auth/invalid-email') {
//   //       console.log('That email address is invalid!');
//   //     }
//   //     console.error(error);
//   //   });
// };

const dispatch = ({type, email, password}, navigate, cb) => {
  switch (type) {
    case 'google':
      googleSignIn().then(() => {
        navigate('Home');
      });

      break;
    default:
      auth().signOut();
      auth()
        .signInWithEmailAndPassword(email, password)
        .then(() => {
          navigate('Home');
        })
        .catch(error => {
          cb(false);

          if (error.code === 'auth/user-not-found') {
            alert('Account does not exist, Try a diff one or SIGNUP!!');
          } else if (error.code === 'auth/wrong-password') {
            alert('Invalid password, Try again');
          } else {
            if (
              error.message.includes('Too many unsuccessful login attempts')
            ) {
              alert(
                'Too many unsuccessful login attempts. Please try again later.',
              );
            } else {
              alert(
                'Opps!! a Unknown error occurred, Try log in at a later time',
              );
            }
          }
          console.dir(error);
        });
  }
};

export const Auth = () => {
  return (
    <Stack.Navigator
      screenOptions={{cardStyle: {backgroundColor: 'transparent'}}}
      headerMode={false}>
      <Stack.Screen
        name="Login"
        component={Login}
        options={{unmountOnBlur: true}}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUp}
        options={{unmountOnBlur: true}}
      />
    </Stack.Navigator>
  );
};
