import React from 'react';
import {StyleSheet, View} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import RootNavigator from '@/navigations/root/RootNavigator';

function App() {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({});

export default App;
