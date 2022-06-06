import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { useState } from 'react';
import { StyleSheet, Text, View, Button as RNButton, Platform } from 'react-native';
import { Button, InputField, ErrorMessage } from '../components';
import Firebase from '../config/firebase';

const auth = Firebase.auth();
const sendEmail = auth.sendPasswordResetEmail

export default function ForgotPassword({ navigation }) {
    const [email, setEmail] = useState('');

    const forgotPassword = async () => {
        try {
            if (email != "") {
                console.log("reset email sent to " + email);
                sendEmail(email)
                    .then(() => {
                        alert("reset email sent to " + email);
                    })
                    .catch(function (e) {
                        console.log(e);
                    });
            }
        } catch (error) {
            setLoginError(error.message);
            alert('Sorry it seems you entered wrong email.');
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar style='dark-content' />
            <Text style={styles.title}>Pozabil sem geslo</Text>
            <InputField
                inputStyle={{
                    fontSize: 14
                }}
                containerStyle={{
                    backgroundColor: '#fff',
                    marginBottom: 20
                }}
                leftIcon='email'
                placeholder='Vnesi email'
                autoCapitalize='none'
                keyboardType='email-address'
                textContentType='emailAddress'
                autoFocus={true}
                value={email}
                onChangeText={text => setEmail(text)}
            />
            <Button
                onPress={forgotPassword}
                backgroundColor='#f57c00'
                title='Pošlji email za ponastavitev gesla'
                tileColor='#fff'
                titleSize={20}
                containerStyle={{
                    marginBottom: 24
                }}
            />
            <Button
                onPress={() => navigation.navigate('Signup')}
                title='Ustvarite nov račun'
                backgroundColor='#3399ff'
                titleSize={20}
                containerStyle={{
                    marginBottom: 24
                  }}
            />
            <Button
                title="Prijava"
                backgroundColor='#3399ff'
                onPress={() => navigation.navigate('Login')}
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
    title: {
        fontSize: 24,
        fontWeight: '600',
        color: '#fff',
        alignSelf: 'center',
        paddingBottom: 24
    }
});