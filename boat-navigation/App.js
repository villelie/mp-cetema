import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import MapScreen from './screens/MapScreen';

const Stack = createStackNavigator();

  function MyStack() {
    return (
      <Stack.Navigator
        initialRouteName="RegisterScreen"
        screenOptions={{
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#3740FE',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}>
        <Stack.Screen 
          name="RegisterScreen" 
          component={RegisterScreen} 
          options={{ title: 'Register' }}
        />       
        <Stack.Screen 
          name="LoginScreen" 
          component={LoginScreen} 
          options={
            {title: 'Login'},
            {headerLeft: null} 
          }
        />
        <Stack.Screen 
         name="MapScreen" 
         component={MapScreen} 
         options={
           { title: 'Map' },
           {headerLeft: null} 
         }
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

