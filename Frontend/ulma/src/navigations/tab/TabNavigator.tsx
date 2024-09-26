import {colors} from '@/constants';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import HomeStackNavigator from '../stack/HomeStackNavigator';
import PayStackNavigator from '../stack/PayStackNavigator';
import EventStackNavigator from '../stack/EventStackNavigator';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MyPageStackNavigator from '../stack/MyPageStackNavigator';

const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.GREEN_700,
      }}>
      <Tab.Screen name="Home" component={HomeStackNavigator} />
      <Tab.Screen name="Pay" component={PayStackNavigator} />
      <Tab.Screen name="Event" component={EventStackNavigator} />
      <Tab.Screen name="MyPage" component={MyPageStackNavigator} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({});

export default TabNavigator;
