import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { useState } from 'react';
import { StyleSheet, Text, View, Button as RNButton, Alert } from 'react-native';

import { Button, InputField, ErrorMessage } from '../components';
import Firebase from '../config/firebase';

const auth = Firebase.auth();
const up = Firebase.firestore();

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [lastname, setLastName] = useState('');
  const [number, setNumber] = useState('');
  const [address, setAddress] = useState('');
  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const [rightIcon, setRightIcon] = useState('eye');
  const [signupError, setSignupError] = useState('');

  const handlePasswordVisibility = () => {
    if (rightIcon === 'eye') {
      setRightIcon('eye-off');
      setPasswordVisibility(!passwordVisibility);
    } else if (rightIcon === 'eye-off') {
      setRightIcon('eye');
      setPasswordVisibility(!passwordVisibility);
    }
  };

  const onHandleSignup = async () => {
    try {
      if (email !== '' && password !== '' && name !== '' && lastname !== '' && number !== '' && address !== '') {
        await auth.createUserWithEmailAndPassword(email, password);
        /*auth.onAuthStateChanged(function(user) {
          user.sendEmailVerification(); 
        });*/
        up
          .collection("Users")
          .doc(auth.currentUser.uid)
          .set({
            name,
            lastname,
            number,
            address
          })
          .then(() => {
            console.log("User added!");
          });
      }
      else{
        alert('Please, make sure you filled all the fields with correct info!');
      }
    } catch (error) {
      setSignupError(error.message);
      alert('Sorry it seems you entered wrong email or/and password');
      console.log(error);
    }
    //auth.signOut();
  };

  return (
    <View style={styles.container}>
      <StatusBar style='dark-content' />
      <Text style={styles.title}>Create new account</Text>
      <InputField
        inputStyle={{
          fontSize: 14
        }}
        containerStyle={{
          backgroundColor: '#fff',
          marginBottom: 20
        }}
        leftIcon='account'
        placeholder='Enter name'
        autoCapitalize='none'
        keyboardType='default'
        textContentType='name'
        autoFocus={true}
        value={name}
        onChangeText={text => setName(text)}
      />
      <InputField
        inputStyle={{
          fontSize: 14
        }}
        containerStyle={{
          backgroundColor: '#fff',
          marginBottom: 20
        }}
        leftIcon='account'
        placeholder='Enter lastname'
        autoCapitalize='none'
        keyboardType='default'
        textContentType='name'
        autoFocus={true}
        value={lastname}
        onChangeText={text => setLastName(text)}
      />
      <InputField
        inputStyle={{
          fontSize: 14
        }}
        containerStyle={{
          backgroundColor: '#fff',
          marginBottom: 20
        }}
        leftIcon='phone'
        placeholder='Enter phone number'
        autoCapitalize='none'
        keyboardType='number-pad'
        textContentType='telephoneNumber'
        autoFocus={true}
        value={number}
        onChangeText={text => setNumber(text)}
      />
      <InputField
        inputStyle={{
          fontSize: 14
        }}
        containerStyle={{
          backgroundColor: '#fff',
          marginBottom: 20
        }}
        leftIcon='map-marker'
        placeholder='Enter address'
        autoCapitalize='none'
        keyboardType='default'
        textContentType='streetAddressLine1'
        autoFocus={true}
        value={address}
        onChangeText={text => setAddress(text)}
      />
      <InputField
        inputStyle={{
          fontSize: 14
        }}
        containerStyle={{
          backgroundColor: '#fff',
          marginBottom: 20
        }}
        leftIcon='email'
        placeholder='Enter email'
        autoCapitalize='none'
        keyboardType='email-address'
        textContentType='emailAddress'
        autoFocus={true}
        value={email}
        onChangeText={text => setEmail(text)}
      />
      <InputField
        inputStyle={{
          fontSize: 14
        }}
        containerStyle={{
          backgroundColor: '#fff',
          marginBottom: 20
        }}
        leftIcon='lock'
        placeholder='Enter password'
        autoCapitalize='none'
        autoCorrect={false}
        secureTextEntry={passwordVisibility}
        textContentType='password'
        rightIcon={rightIcon}
        value={password}
        onChangeText={text => setPassword(text)}
        handlePasswordVisibility={handlePasswordVisibility}
      />
      {signupError ? <ErrorMessage error={signupError} visible={true} /> : null}
      <Button
        onPress={onHandleSignup}
        backgroundColor='#f57c00'
        title='Signup'
        tileColor='#fff'
        titleSize={20}
        containerStyle={{
          marginBottom: 24
        }}
      />
      <RNButton
        onPress={() => navigation.navigate('Login')}
        title='Go to Login'
        color='#00008B'
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e93b81',
    paddingTop: 50,
    paddingHorizontal: 12
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
    alignSelf: 'center',
    paddingBottom: 24
  }
});
