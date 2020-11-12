import * as React from 'react';
import { StatusBar } from 'react-native';
import Navigation from './screens/Navigator';
import { colors } from './helpers/globalVariables';


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
