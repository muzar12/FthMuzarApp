import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, IconButton, InputField, ErrorMessage } from '../components';
import Firebase from '../config/firebase';

const auth = Firebase.auth();

export default function SettingsScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [currentPassword, setPassword] = useState('');
    const [NewPassword, setNewPassword] = useState('');
    const [passwordVisibility, setPasswordVisibility] = useState(true);
    const [rightIcon, setRightIcon] = useState('eye');
    const [loginError, setLoginError] = useState('');

    const handleSignOut = async () => {
        try {
            await auth.signOut();
        } catch (error) {
            console.log(error);
        }
    };

    const handlePasswordVisibility = () => {
        if (rightIcon === 'eye') {
            setRightIcon('eye-off');
            setPasswordVisibility(!passwordVisibility);
        } else if (rightIcon === 'eye-off') {
            setRightIcon('eye');
            setPasswordVisibility(!passwordVisibility);
        }
    };

    function emailCred() {
        try {
            auth.EmailAuthProvider.credential(auth.currentUser, currentPassword);
        } catch (error) {
            console.log(error + "Napaka pri reautentikaciji.");
        }
    }

    async function changePassword() {
        await auth.currentUser.reauthenticateWithCredential(emailCred)
            .then(() => {
                // User successfully reauthenticated.
                return auth.currentUser.updatePassword(NewPassword);
            }).catch((error) => { console.log(error); });
    }

    async function changeEmail() {
        await auth.currentUser.reauthenticateWithCredential(emailCred)
            .then(() => {
                // User successfully reauthenticated.
                var user = auth.currentUser;
                user.updateEmail(newEmail).then(() => {
                    console.log("Email updated!");
                })
            }).catch((error) => { console.log(error); });
    }

    return (
        <View style={styles.container}>
            <StatusBar style='dark-content' />
            <View style={styles.row}>
                <IconButton
                    name='leftcircle'
                    size={24}
                    color='#fff'
                    onPress={() => navigation.goBack()}
                />
                <Text style={styles.title}>Nastavitve</Text>
                <IconButton
                    name='logout'
                    size={24}
                    color='#fff'
                    onPress={handleSignOut}
                />
            </View>
            <View style={styles.row}>
                <Text style={styles.title}>Pri menjavi gesla ali emaila, je potrebno vpisati trenutno geslo !</Text>
            </View>
            <InputField
                inputStyle={{
                    fontSize: 14
                }}
                containerStyle={{
                    backgroundColor: '#fff',
                    marginBottom: 20
                }}
                leftIcon='lock'
                placeholder='Vnesite trenutno geslo'
                autoCapitalize='none'
                autoCorrect={false}
                secureTextEntry={passwordVisibility}
                textContentType='password'
                rightIcon={rightIcon}
                value={currentPassword}
                onChangeText={text => setPassword(text)}
                handlePasswordVisibility={handlePasswordVisibility}
            />
            {loginError ? <ErrorMessage error={loginError} visible={true} /> : null}
            <InputField
                inputStyle={{
                    fontSize: 14
                }}
                containerStyle={{
                    backgroundColor: '#fff',
                    marginBottom: 20
                }}
                leftIcon='email'
                placeholder='Vnestie nov email'
                autoCapitalize='none'
                keyboardType='email-address'
                textContentType='emailAddress'
                autoFocus={true}
                value={email}
                onChangeText={text => setEmail(text)}
            />
            <Button
                onPress={() => changeEmail()}
                backgroundColor='#f57c00'
                title='Zamenjaj Email'
                tileColor='#fff'
                titleSize={20}
                containerStyle={{
                    marginBottom: 24
                }}
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
                placeholder='Vnesite novo geslo'
                autoCapitalize='none'
                autoCorrect={false}
                secureTextEntry={passwordVisibility}
                textContentType='password'
                rightIcon={rightIcon}
                value={NewPassword}
                onChangeText={text => setNewPassword(text)}
                handlePasswordVisibility={handlePasswordVisibility}
            />
            {loginError ? <ErrorMessage error={loginError} visible={true} /> : null}
            <Button
                onPress={() => changePassword()}
                backgroundColor='#f57c00'
                title='Zamenjaj geslo'
                tileColor='#fff'
                titleSize={20}
                containerStyle={{
                    marginBottom: 24
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#ADD8E6',
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
    }
  });