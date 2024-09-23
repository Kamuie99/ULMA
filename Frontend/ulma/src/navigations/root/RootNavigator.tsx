import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import AuthStackNavigator from '../stack/AuthStackNavigator';
import EventStackNavigator from '../stack/EventStackNavigator';
import PayStackNavigator from '../stack/PayStackNavigator';
import SettingStackNavigator from '../stack/SettingStackNavigator';
import HomeStackNavigator from '../stack/HomeStackNavigator';
import {colors} from '@/constants';

const Tab = createBottomTabNavigator();

function RootNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.GREEN_700,
      }}>
      <Tab.Screen name="Home" component={HomeStackNavigator} />
      <Tab.Screen name="Auth" component={AuthStackNavigator} />
      <Tab.Screen name="Pay" component={PayStackNavigator} />
      <Tab.Screen name="Event" component={EventStackNavigator} />
      <Tab.Screen name="Setting" component={SettingStackNavigator} />
    </Tab.Navigator>
  );
}

export default RootNavigator;
