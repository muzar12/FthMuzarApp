import { StatusBar } from 'expo-status-bar';
import React, { useContext } from 'react';
import { TextInput, StyleSheet, Text, View, Button as RNButton, Platform } from 'react-native';
import { useState } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';

import { Button, IconButton } from '../components';
import Firebase from '../config/firebase';
import { AuthenticatedUserContext } from '../navigation/AuthenticatedUserProvider';
import appointments from '../handleAppointments/appointments';

const auth = Firebase.auth();
const db = Firebase.firestore();
const datum = new Date().toLocaleString()

export default function HomeScreen({ navigation }) {
  const day = new Date().getDate();
  const minute = new Date().getMinutes();
  const hour = new Date().getHours();
  const [name, setName] = useState('');
  const [lastname, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [post, setPost] = useState('');
  const [ZZZS, setZZZS] = useState('');
  var prednost = "";
  const { user } = useContext(AuthenticatedUserContext);
  const onHandleAppointment = async () => {
    try{
      if (name !== '' && lastname !== '' && address !== '' && post !== '' && ZZZS !== ''){
        db
        .collection("Napotnica")
        .doc(auth.currentUser.uid + "_"+ day + "_" + hour + ":" + minute)
        .set({name,
          lastname,
          address,
          post,
          ZZZS,
          prednost,
          datum
        })
        .then(() => {
          alert ('Napotnica oddana');
          console.log("Appointment added!");
          appointments(name, lastname, prednost, auth.currentUser.uid);
          navigation.navigate('Home');
        });
      } 
    }catch (error) {
    alert ('Sorry wrong values.');
    console.log(error);
    }
  }
  const handleSignOut = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.log(error);
    }
  };
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    {label: 'Redno', value: 'redno'},
    {label: 'Hitro', value: 'hitro'},
    {label: 'Zelo Hitro', value: 'zeloHitro'}
  ]);

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
      <Text style={styles.text}>THIS IS NAPOTNICA !</Text>
      <TextInput
        style={styles.input}
        placeholder="Ime"
        keyboardType="default"
        textContentType='name'
        value={name}
        onChangeText={text => setName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Priimek"
        keyboardType="default"
        textContentType='name'
        value={lastname}
        onChangeText={text => setLastName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Ulica in hišna številka"
        keyboardType="default"
        textContentType='streetAddressLine1'
        value={address}
        onChangeText={text => setAddress(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="pošta in poštna številka"
        keyboardType="default"
        textContentType='streetAddressLine2'
        value={post}
        onChangeText={text => setPost(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="številka ZZZS kartice"
        keyboardType="number-pad"
        value={ZZZS}
        onChangeText={text => setZZZS(text)}        
      />
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        onChangeValue={(value) => {
          prednost = value;
          console.log(value);
        }}
      />
      <Button
        style={styles.button}
        title="SLIKA NAPOTNICE"
        size = {50}
        backgroundColor = '#3399ff'
        onPress={() => navigation.navigate('UploadScreen')}
        containerStyle={{
          marginBottom: 24
        }}
      />
      <Button
        onPress={onHandleAppointment}
        backgroundColor='#f57c00'
        title='Pošlji Napotnico'
        tileColor='#fff'
        titleSize={20}
        containerStyle={{
          marginBottom: 24
        }}
      />
      <Button
        title="HOME"
        size = {50}
        backgroundColor = '#3399ff'
        onPress={() => navigation.navigate('Home')}
        containerStyle={{
          marginBottom: 24
        }}
      />
      
      <Button
        title="Samoplačniško"
        size = {50}
        backgroundColor = '#3399ff'
        onPress={() => navigation.navigate('Samoplacnik')}
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
  },
  button: {
    paddingBottom: 20,
    marginBottom: 20
  },
});