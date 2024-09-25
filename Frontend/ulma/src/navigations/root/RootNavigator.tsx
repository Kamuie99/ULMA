import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import TabNavigator from '../tab/TabNavigator';
import useAuthStore from '@/store/useAuthStore';
import AuthStackNavigator from '../stack/AuthStackNavigator';

const Tab = createBottomTabNavigator();

function RootNavigator() {
  const {isLoggedIn} = useAuthStore();

  return <>{isLoggedIn ? <TabNavigator /> : <AuthStackNavigator />}</>;
}

export default RootNavigator;
