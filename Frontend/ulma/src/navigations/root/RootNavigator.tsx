import React from 'react';
import TabNavigator from '../tab/TabNavigator';
import useAuthStore from '@/store/useAuthStore';
import AuthStackNavigator from '../stack/AuthStackNavigator';

function RootNavigator() {
  const {isLoggedIn} = useAuthStore();

  return <>{isLoggedIn ? <TabNavigator /> : <AuthStackNavigator />}</>;
}

export default RootNavigator;
