import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { useState } from 'react';
import { StyleSheet, Text, View, Button as RNButton, Platform } from 'react-native';
import { Button, InputField, ErrorMessage } from '../components';
import Firebase from '../config/firebase';

const auth = Firebase.auth();
const sendEmail = auth.sendPasswordResetEmail

export default function forgotPassword({ navigation }) {
    const [email, setEmail] = useState('');
    const [passwordVisibility, setPasswordVisibility] = useState(true);
    const [rightIcon, setRightIcon] = useState('eye');
    const [loginError, setLoginError] = useState('');

    const handlePasswordVisibility = () => {
        if (rightIcon === 'eye') {
            setRightIcon('eye-off');
            setPasswordVisibility(!passwordVisibility);
        } else if (rightIcon === 'eye-off') {
            setRightIcon('eye');
            setPasswordVisibility(!passwordVisibility);
        }
    };

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
            <Text style={styles.title}>Forgot password</Text>
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
            <Button
                onPress={forgotPassword}
                backgroundColor='#f57c00'
                title='Password RESET'
                tileColor='#fff'
                titleSize={20}
                containerStyle={{
                    marginBottom: 24
                }}
            />
            <RNButton
                onPress={() => navigation.navigate('Signup')}
                title='Go to Signup'
                color='#00008B'
            />
            <Button
                title="Go to Login"
                onPress={() => navigation.navigate('Login')}
                titleStyle={{
                    color: '#039BE5'
                }}
                type="clear"
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