import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { useState } from 'react';
import { StyleSheet, Text, View, Button as RNButton, Platform } from 'react-native';
import { Button, InputField, ErrorMessage } from '../components';
import Firebase from '../config/firebase';

const auth = Firebase.auth();

export default function SettingsScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [currentPassword, setPassword] = useState('');
    const [NewPassword, setNewPassword] = useState('');
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

    const reauthenticate = async (currPassword) => {
        var user = auth.currentUser;
        var cred = auth.EmailAuthProvider.credential(
            user.email, currPassword);
        return user.reauthenticateWithCredential(cred);
    }

    const changePassword = async (currPassword, newPassword) => {
        this.reauthenticate(currPassword).then(() => {
            var user = auth.currentUser;
            user.updatePassword(newPassword).then(() => {
                console.log("Password updated!");
            }).catch((error) => { console.log(error); });
        }).catch((error) => { console.log(error); });
    }

    const changeEmail = async (currPassword, newEmail) => {
        this.reauthenticate(currPassword).then(() => {
            var user = auth.currentUser;
            user.updateEmail(newEmail).then(() => {
                console.log("Email updated!");
            }).catch((error) => { console.log(error); });
        }).catch((error) => { console.log(error); });
    }

    return (
        <View style={styles.container}>
            <StatusBar style='dark-content' />
            <Text style={styles.title}>Settings Screen</Text>
            <Text style={styles.title}>1st you have to authenticate and than you can change your password or email.</Text>
            <InputField
                inputStyle={{
                    fontSize: 14
                }}
                containerStyle={{
                    backgroundColor: '#fff',
                    marginBottom: 20
                }}
                leftIcon='lock'
                placeholder='Enter current password'
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
            <Button
                onPress={reauthenticate(currentPassword)}
                backgroundColor='#f57c00'
                title='Authenticate'
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
                leftIcon='email'
                placeholder='Enter new email'
                autoCapitalize='none'
                keyboardType='email-address'
                textContentType='emailAddress'
                autoFocus={true}
                value={email}
                onChangeText={text => setEmail(text)}
            />
            <Button
                onPress={changeEmail(currentPassword, email)}
                backgroundColor='#f57c00'
                title='Password RESET'
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
                placeholder='Enter new password'
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
                onPress={changePassword(currentPassword, NewPassword)}
                backgroundColor='#f57c00'
                title='change password'
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