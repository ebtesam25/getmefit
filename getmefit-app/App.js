import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Splash from './components/splash';
import Home from './components/home';
import Hometwo from './components/hometwo';
import Menu from './components/menu';
import Pulse from './components/pulse';
import Temperature from './components/temperature';
import Oxygen from './components/oxygen';
import Steps from './components/steps';
import Gsr from './components/gsr';
import Purifier from './components/purifier';
import Emergency from './components/emergency';

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
      <Stack.Screen 
        name="Menu" 
        component={Menu}
        options={{ headerShown: false}}  
      />
       <Stack.Screen 
        name="Pulse" 
        component={Pulse}
        options={{ headerShown: false}}  
      />
      <Stack.Screen 
        name="Temperature" 
        component={Temperature}
        options={{ headerShown: false}}  
      />
      <Stack.Screen 
        name="Oxygen" 
        component={Oxygen}
        options={{ headerShown: false}}  
      />
      <Stack.Screen 
        name="Steps" 
        component={Steps}
        options={{ headerShown: false}}  
      />
      <Stack.Screen 
        name="Gsr" 
        component={Gsr}
        options={{ headerShown: false}}  
      />
      <Stack.Screen 
        name="Purifier" 
        component={Purifier}
        options={{ headerShown: false}}  
      />
      <Stack.Screen 
        name="Emergency" 
        component={Emergency}
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
