import {payNavigations} from '@/constants/navigations';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {StyleSheet, View} from 'react-native';

import {colors} from '@/constants';
import Icon from 'react-native-vector-icons/Entypo';

import AccountinputScreen from '@/screens/Pay/AccountinputScreen';
import AddhistoryScreen from '@/screens/Pay/AddhistoryScreen';
import ChangeresultScreen from '@/screens/Pay/ChargeresultScreen';
import FriendshipselectScreen from '@/screens/Pay/FriendshipselectScreen';
import SendresultScreen from '@/screens/Pay/SendresultScreen';
import PaylistScreen from '@/screens/Pay/PaylistScreen';
import PayrechargingScreen from '@/screens/Pay/PayrechargingScreen';
import RecommendOptionScreen from '@/screens/Pay/RecommendOptionScreen';
import SendingScreen from '@/screens/Pay/SendingScreen';
import AccounthistoryScreen from '@/screens/Pay/AccounthistoryScreen';
import AddoptionScreen from '@/screens/Pay/AddoptionScreen';

export type payStackParamList = {
  [payNavigations.ACCOUNT_HISTORY]: undefined;
  [payNavigations.ACCOUNT_INPUT]: undefined;
  [payNavigations.ADD_HISTORY]: undefined;
  [payNavigations.ADDOPTION]: undefined;
  [payNavigations.CHANGE_RESULT]: undefined;
  [payNavigations.FRIENDHSHIP_SECLECT]: undefined;
  [payNavigations.PAY_LIST]: undefined;
  [payNavigations.PAY_RECHARGE]: undefined;
  [payNavigations.RECOMMEND_OPTION]: undefined;
  [payNavigations.SENDING]: undefined;
  [payNavigations.SEND_RESULT]: undefined;
};

const Stack = createStackNavigator<payStackParamList>();

function PayStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        cardStyle: {
          backgroundColor: colors.WHITE,
        },
        headerStyle: {
          backgroundColor: colors.WHITE,
        },
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontSize: 15,
        },
        headerTintColor: colors.BLACK,
        headerBackImage: () => {
          return <Icon name="chevron-left" size={24} color={colors.BLACK} />;
        },
      }}>
      {/* <Stack.Screen
        name={payNavigations.ACCOUNT_HISTORY}
        component={AccounthistoryScreen}
        options={{
          headerTitle: ' ',
          headerShown: false,
        }}
      /> */}
      {/* <Stack.Screen
        name={payNavigations.ACCOUNT_INPUT}
        component={AccountinputScreen}
        options={{
          headerTitle: '계좌 입력',
          headerBackImage: () => {
            return <Icon name="cross" size={24} color={colors.BLACK} />;
          },
        }}
      /> */}
      {/* <Stack.Screen
        name={payNavigations.ADD_HISTORY}
        component={AddhistoryScreen}
        options={{
          headerTitle: '이벤트 자세히 보기',
          headerStyle: {backgroundColor: colors.LIGHTGRAY},
        }}
      /> */}
      <Stack.Screen
        name={payNavigations.ADD_HISTORY}
        component={AddoptionScreen}
        options={{
          headerTitle: '',
          headerShown: false,
        }}
      />
      {/* <Stack.Screen
        name={payNavigations.SEND_RESULT}
        component={SendresultScreen}
        options={{
          headerTitle: '송금 결과',
          headerBackImage: () => {
            return <Icon name="cross" size={24} color={colors.BLACK} />;
          },
        }}
      /> */}
      {/* <Stack.Screen
        name={payNavigations.FRIENDHSHIP_SECLECT}
        component={FriendshipselectScreen}
        options={{
          headerTitle: 'AI 금액 추천',
        }}
      /> */}
      {/* 
      <Stack.Screen
        name={payNavigations.PAY_RECHARGE}
        component={PayrechargingScreen}
        options={{
          headerTitle: '계좌 내역 확인하기',
        }}
      /> */}
      {/* <Stack.Screen
        name={payNavigations.RECOMMEND_OPTION}
        component={RecommendOptionScreen}
        options={{
          headerTitle: ' ',
          headerShown: false,
        }}
      /> */}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({});

export default PayStackNavigator;
