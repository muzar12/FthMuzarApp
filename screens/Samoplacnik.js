import { StatusBar } from 'expo-status-bar';
import React, { useContext } from 'react';
import { TextInput, StyleSheet, Text, View, Button as RNButton } from 'react-native';

import { Button, IconButton } from '../components';
import Firebase from '../config/firebase';
import { AuthenticatedUserContext } from '../navigation/AuthenticatedUserProvider';

const auth = Firebase.auth();

export default function Samoplacnik({ navigation }) {
  const { user } = useContext(AuthenticatedUserContext);
  const handleSignOut = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <View style={styles.container}>
      <StatusBar style='dark-content' />
      <View style={styles.row}>
        <Text style={styles.title}>Welcome {user.email}!</Text>
        <IconButton
          name='logout'
          size={24}
          color='#fff'
          onPress={handleSignOut}
        />
      </View>
      <TextInput
        style={styles.input}
        placeholder="Ime"
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Priimek"
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Ulica in hišna številka"
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="pošta in poštna številka"
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="število obiskov"
        keyboardType="number-pad"
      />
      <Text style={styles.text}>THIS IS SAMOPLACNIK ! </Text>
      <RNButton
        title="Napotnica"
        size = {50}
        onPress={() => navigation.navigate('Napotnica')}
      />
      
      <RNButton
        title="Home"
        size = {50}
        onPress={() => navigation.navigate('Home')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DDDDDD',
    paddingTop: 50,
    paddingHorizontal: 12
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff'
  },
  text: {
    fontSize: 16,
    fontWeight: 'normal',
    color: '#fff'
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  }
});