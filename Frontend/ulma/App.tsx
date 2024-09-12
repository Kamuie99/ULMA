import React from 'react';
import {StyleSheet, View} from 'react-native';
import SignupScreen from '@/screens/Auth/SignupScreen';
import LoginScreen from '@/screens/Auth/LoginScreen';

function App() {
  return (
    <View style={styles.container}>
      {/* <SignupScreen /> */}
      <LoginScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
});

export default App;
