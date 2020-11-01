import React, { useState, useEffect } from 'react';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {createStackNavigator} from 'react-navigation-stack';
import MapScreen from '../views/MapScreen';
import InfoScreen from '../views/InfoScreen';
import WeatherScreen from '../views/WeatherScreen';
import {Icon} from 'native-base';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Constants from 'expo-constants';
import * as Location from 'expo-location';



function MapScreen() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Map</Text>
      </View>
    );
  }
  
  function InfoScreen() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Info</Text>
      </View>
    );
  }
  
  function WeatherScreen() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Weather</Text>
      </View>
    );
  }
  
  const Tab = createBottomTabNavigator();
  
  function MyTabs() {
    return (
      <Tab.Navigator>
        <Tab.Screen name="Map" component={MapScreen} />
        <Tab.Screen name="Info" component={InfoScreen} />
        <Tab.Screen name="Weather" component={WeatherScreen} />
      </Tab.Navigator>
    );
  }