import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Splash from './components/splash';
import Home from './components/home';
import Hometwo from './components/hometwo';
import Notification from './components/notification';

const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen 
        name="Splash" 
        component={Splash}
        options={{ headerShown: false}} 
        /> 
        <Stack.Screen 
        name="Home" 
        component={Home}
        options={{ headerShown: false}}  
      />
      <Stack.Screen 
        name="Hometwo" 
        component={Hometwo}
        options={{ headerShown: false}}  
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
}
