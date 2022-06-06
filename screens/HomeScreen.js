import { StatusBar } from 'expo-status-bar';
import React, { useContext, useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Button as RNButton, Platform, SafeAreaView, ScrollView } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { IconButton } from '../components';
import Firebase from '../config/firebase';
import { AuthenticatedUserContext } from '../navigation/AuthenticatedUserProvider';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const auth = Firebase.auth();
const db = Firebase.firestore();

async function registerForPushNotificationsAsync() {
  let token;
  if (Platform.OS === 'android' || Platform.OS === 'ios') {
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      db
        .collection("Users")
        .doc(auth.currentUser.uid)
        .update({ token })
    } else {
      alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
    return token;
  } else {
    console.log("Expo notifications not supported on web.")
  }
}

export default function HomeScreen({ navigation }) {
  const [expoPushToken, setExpoPushToken] = useState('');
  const notificationListener = useRef();
  const responseListener = useRef();
  const { user } = useContext(AuthenticatedUserContext);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style='dark-content' />
      <View style={styles.row}>
        <IconButton
          name='setting'
          size={24}
          color='#fff'
          onPress={() => navigation.navigate('SettingsScreen')}
        />
        <Text style={styles.title}>Domača stran</Text>
        <IconButton
          name='logout'
          size={24}
          color='#fff'
          onPress={handleSignOut}
        />
      </View>
      <View style={styles.container1}>
        <View style={styles.row}>
          <Text style={styles.title}>Pozdravljeni, prijavljen e-mail je: {user.email}</Text>
        </View>
      </View>
      <View style={styles.container}>
        <View style={styles.row}>
          <RNButton
            title="Napotnica"
            size={50}
            onPress={() => navigation.navigate('Napotnica')}
          />
          <RNButton
            title="Samoplačniško"
            size={50}
            onPress={() => navigation.navigate('Samoplacnik')}
          />
        </View>
        <SafeAreaView style={styles.container}>
          <ScrollView style={styles.scrollView}>
            <Text style={styles.textTerapij}>Naročeni ste: </Text>
            <Text style={styles.textTerapij}>{"\n"}Trenutno še niste naročeni na terapije.</Text>
          </ScrollView>
        </SafeAreaView>
      </View>
    </View>
  );
}

/*async function sendPushNotification(expoPushToken) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: 'Obvestilo o terapiji !',
    body: 'Ne pozabite, čez 7 dni imate prvo terapijo pri Fizioterapiji Mužar !'
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}*/

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ADD8E6',
    paddingTop: 50,
    paddingHorizontal: 12
  },
  container1: {
    justifyContent: "center",
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12
  },
  scrollView: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 50
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
  textTerapij: {
    flexDirection: "row",
    marginBottom: 10,
    fontSize: 16,
    textAlign: "center",
    color: "#000",
    fontWeight: 'normal',
  },
  image: {
    flex: 1,
    justifyContent: "center"
  }
});