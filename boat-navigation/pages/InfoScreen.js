import React from 'react';
import { Button, Text, View } from 'react-native';

const InfoScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Info screen</Text>
      <Button
        title="Show nautical warnings"
        onPress={() => navigation.navigate('Nautical Warnings')}
      />
    </View>
  );
}

export default InfoScreen;