import React from 'react';
import {StyleSheet, View} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import RootNavigator from '@/navigations/root/RootNavigator';
import EventScreen from '@/screens/Events/EventScreen';
import EventAddScreen from '@/screens/Events/EventAddScreen';
import EventDateScreen from '@/screens/Events/EventDateScreen';
import PayPage from '@/screens/Pay/PaylistScreen';
import AccountinputScreen from '@/screens/Pay/AccountinputScreen';
import AddhistoryScreen from '@/screens/Pay/AddhistoryScreen';
import ChangeresultScreen from '@/screens/Pay/ChargeresultScreen';
import FriendshipselectScreen from '@/screens/Pay/FriendshipselectScreen';
import PayrechargingScreen from '@/screens/Pay/PayrecharginScreen';
import RecommendationScreen from '@/screens/Pay/RecommendOptionScreen';
import SendingScreen from '@/screens/Pay/SendingScreen';
import SendresultScreen from '@/screens/Pay/SendresultScreen';

function App() {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
    // <NavigationContainer>
    //   <SendresultScreen />
    // </NavigationContainer>
  );
}

const styles = StyleSheet.create({});

export default App;
