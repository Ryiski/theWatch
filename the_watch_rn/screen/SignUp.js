import React, {useState} from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  GoogleSigninButton,
  GoogleSignin,
} from '@react-native-community/google-signin';
import auth from '@react-native-firebase/auth';
import Loading from '../components/Loading';
import {CommonActions} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import firestore from '@react-native-firebase/firestore';

const googleSignIn = async () => {
  try {
    const {idToken} = await GoogleSignin.signIn();
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    await auth()
      .signInWithCredential(googleCredential)
      .then(async res => {
        console.log(res);
        await firestore()
          .collection('Users')
          .doc(res.user.uid)
          .set({
            profilePic: res.user.photoURL,
            favorites: [],
            watched: [],
            watchList: [],
          });
      });
  } catch (error) {
    alert('Opps!! a Unknown error occurred, Try log in at a later time');
  }
};

const dispatch = ({type, email, password, userName}, navigate, cb) => {
  switch (type) {
    case 'google':
      googleSignIn().then(() => {
        navigate('Home');
      });

      break;
    default:
      auth()
        .createUserWithEmailAndPassword(email, password)
        .then(async res => {
          res.user.updateProfile({
            displayName: userName,
          });
          res.user.sendEmailVerification();
          await firestore()
            .collection('Users')
            .doc(res.user.uid)
            .set({
              profilePic: null,
              favorites: [],
              watched: [],
              watchList: [],
            });

          navigate('Home');
        })
        .catch(error => {
          console.log(error);

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

export const SignUp = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [loginInProgress, setLoginInProgress] = useState(false);
  const resetAction = CommonActions.reset({
    index: 0,
    routes: [{name: 'Login'}],
  });
  return (
    <ScrollView
      style={{backgroundColor: 'blue'}}
      contentContainerStyle={{
        backgroundColor: 'red',
        flexGrow: 1,
        alignItems: 'stretch',
      }}>
      <LinearGradient
        colors={['#1e343b', '#345a67', '#030322']}
        style={{flex: 1, height: '100%'}}>
        <View colors={['#1e343b', '#345a67', '#030322']} style={{flex: 1}}>
          <View style={{flex: 1}}>
            <View
              style={{
                flex: 1,
                justifyContent: 'flex-end',
                paddingHorizontal: 40,
                maxWidth: 500,
              }}>
              <Text style={{paddingLeft: 10, color: '#eee', fontSize: 15}}>
                User Name
              </Text>
              <TextInput
                placeholder="johnDoe"
                style={{
                  backgroundColor: '#eee',
                  marginVertical: 10,
                  borderRadius: 50,
                  padding: 10,
                }}
                value={userName}
                onChangeText={text => setUserName(text)}
              />
              <Text style={{paddingLeft: 10, color: '#eee', fontSize: 15}}>
                Email
              </Text>
              <TextInput
                placeholder="johnDoe@gmail.com"
                style={{
                  backgroundColor: '#eee',
                  marginVertical: 10,
                  borderRadius: 50,
                  padding: 10,
                }}
                value={email}
                onChangeText={text => setEmail(text)}
              />
              <Text style={{paddingLeft: 10, color: '#eee', fontSize: 15}}>
                Password
              </Text>
              <TextInput
                placeholder="********"
                style={{
                  backgroundColor: '#eee',
                  marginVertical: 10,
                  borderRadius: 50,
                  padding: 10,
                }}
                secureTextEntry={true}
                value={password}
                onChangeText={text => setPassword(text)}
              />
              <TouchableOpacity
                disabled={email != '' && password != '' ? false : true}
                title="Sign In"
                style={{
                  backgroundColor: 'rgb(185, 115, 67)',
                  padding: 12,
                  borderRadius: 50,
                  marginVertical: 10,
                  minHeight: 50,
                }}
                onPress={() => {
                  setLoginInProgress(true);
                  dispatch(
                    {email, password, userName},
                    navigation.navigate,
                    setLoginInProgress,
                  );
                }}>
                {loginInProgress ? (
                  <Loading size={50} />
                ) : (
                  <Text
                    style={{color: '#eee', fontSize: 15, textAlign: 'center'}}>
                    Sign Up
                  </Text>
                )}
              </TouchableOpacity>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginVertical: 10,
                }}>
                <Text style={{color: '#eee', fontSize: 15}}>
                  Already have an account ?
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.dispatch(resetAction)}>
                  <Text
                    style={{
                      color: 'rgb(185, 115, 67)',
                      fontSize: 15,
                      paddingLeft: 5,
                    }}>
                    Login Here
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  flex: 1,
                  marginHorizontal: 10,
                  borderBottomWidth: 1,
                  borderColor: '#eee',
                }}
              />
              <Text style={{color: '#eee', paddingBottom: 2}}> or </Text>
              <View
                style={{
                  flex: 1,
                  marginHorizontal: 10,
                  borderBottomWidth: 1,
                  borderColor: '#eee',
                }}
              />
            </View>
            <View style={{alignItems: 'center', marginVertical: 10, flex: 0.5}}>
              <GoogleSigninButton
                onPress={() => {
                  dispatch({type: 'google'}, navigation.navigate);
                }}
              />
            </View>
          </View>
        </View>
      </LinearGradient>
    </ScrollView>
  );
};
