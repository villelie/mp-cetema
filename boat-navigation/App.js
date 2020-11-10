import * as React from 'react';
import { StatusBar } from 'react-native';
import Navigation from './pages/Navigator';
import { colors } from './GlobalVariables';


const App = () => {
  return (
    <>
      <StatusBar
        backgroundColor={colors.darkPrimary}
      />
      <Navigation />
    </>
  );
}

export default App;
