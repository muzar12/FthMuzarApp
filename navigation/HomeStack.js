import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../screens/HomeScreen';
import Samoplacnik from '../screens/Samoplacnik';
import Napotnica from '../screens/Napotnica';
import UploadScreen from '../screens/UploadScreen';

const Stack = createStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator headerMode='none'>
      <Stack.Screen name='Home' component={HomeScreen} />
      <Stack.Screen name='Samoplacnik' component={Samoplacnik} />
      <Stack.Screen name='Napotnica' component={Napotnica} />
      <Stack.Screen name='UploadScreen' component={UploadScreen} />
    </Stack.Navigator>
  );
}