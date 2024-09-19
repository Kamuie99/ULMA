import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {authNavigations} from '@/constants/navigations';
import {colors} from '@/constants';
import LoginScreen from '@/screens/Auth/LoginScreen';
import LoginHomeScreen from '@/screens/Auth/LoginHomeScreen';
import SignupScreen from '@/screens/Auth/SignupScreen';
import SignupHomeScreen from '@/screens/Auth/SignupHomeScreen';

export type AuthStackParamList = {
  [authNavigations.LOGIN_HOME]: undefined;
  [authNavigations.LOGIN]: undefined;
  [authNavigations.SIGNUP_HOME]: undefined;
  [authNavigations.SIGNUP]: undefined;
};

const Stack = createStackNavigator<AuthStackParamList>();

function AuthStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        cardStyle: {
          backgroundColor: colors.WHITE,
        },
        headerStyle: {
          // shadowColor: colors.GRAY,
          backgroundColor: colors.WHITE,
        },
        headerTitleStyle: {
          fontSize: 15,
        },
        headerTintColor: colors.BLACK,
      }}>
      <Stack.Screen
        name={authNavigations.LOGIN_HOME}
        component={LoginHomeScreen}
        options={{
          headerTitle: ' ',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={authNavigations.SIGNUP_HOME}
        component={SignupHomeScreen}
        options={{
          headerTitle: ' ',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={authNavigations.LOGIN}
        component={LoginScreen}
        options={{
          headerTitle: '로그인',
        }}
      />
      <Stack.Screen
        name={authNavigations.SIGNUP}
        component={SignupScreen}
        options={{
          headerTitle: '회원가입',
        }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({});

export default AuthStackNavigator;
