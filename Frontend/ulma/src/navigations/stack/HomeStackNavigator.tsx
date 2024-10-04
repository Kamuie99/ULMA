import {homeNavigations} from '@/constants/navigations';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {StyleSheet, View} from 'react-native';

import {colors} from '@/constants';
import Icon from 'react-native-vector-icons/Entypo';
import LandingPage from '@/screens/Home/LandingScreen';
import ScheduleMainScreen from '@/screens/Home/ScheduleMainScreen';

export type homeStackParamList = {
  [homeNavigations.HOME]: undefined;
  [homeNavigations.LANDING]: undefined;
  [homeNavigations.SCHEDULE_MAIN]: undefined;
};

const Stack = createStackNavigator<homeStackParamList>();

function HomeStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        cardStyle: {
          backgroundColor: colors.WHITE,
        },
        headerStyle: {
          backgroundColor: colors.WHITE,
        },
        headerTitleAlign: 'left',
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: 'bold',
        },
        headerTintColor: colors.BLACK,
      }}>
      <Stack.Screen
        name={homeNavigations.SCHEDULE_MAIN}
        component={ScheduleMainScreen}
        options={{
          headerTitle: '경조사 일정 관리',
        }}
      />
      <Stack.Screen
        name={homeNavigations.LANDING} // LandingPage 추가
        component={LandingPage}
        options={{
          headerTitle: '홈',
        }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({});

export default HomeStackNavigator;
