import React, { useState, useEffect } from "react";
import { LogBox } from "react-native";
import * as Expo from "expo";
import * as Font from "expo-font";
import { StatusBar } from "expo-status-bar";
import Navigation from "./src/helpers/Navigator";
import * as Notifications from 'expo-notifications';
import {AppearanceProvider} from 'react-native-appearance';
import {ThemeProvider} from './src/helpers/ThemeContext';
import {useTheme} from './src/helpers/ThemeContext';

const App = () => {

  const {colors, isDark} = useTheme();

  LogBox.ignoreLogs(["Setting a timer"]);

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  const [fontReady, setFontReady] = useState(false);
  const loadFonts = async () => {
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
    });
    setFontReady(true);
  };
  useEffect(() => {
    loadFonts();
  }, []);

  if (!fontReady) {
    return <Expo.AppLoading />;
  }
//Status barstyle not working due to use of (headers) NativeBase
  return (
    <>
    <AppearanceProvider>
      <ThemeProvider>
        <StatusBar 
        backgroundColor={colors.background}
        barStyle={isDark?"light-content":'dark-content'}
        />
        <Navigation  />
      </ThemeProvider>      
    </AppearanceProvider>
      
    </>
  );
};
//style={isDark? "light" : "dark"}

export default App;
