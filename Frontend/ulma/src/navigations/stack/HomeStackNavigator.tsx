import {homeNavigations} from '@/constants/navigations';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Icon2 from 'react-native-vector-icons/Ionicons';

import {colors} from '@/constants';
import Icon from 'react-native-vector-icons/Entypo';
import LandingPage from '@/screens/Home/LandingScreen';
import ScheduleMainScreen from '@/screens/Home/ScheduleMainScreen';
import ScheduleAddScreen from '@/screens/Home/ScheduleAddScreen';

export type homeStackParamList = {
  [homeNavigations.HOME]: undefined;
  [homeNavigations.LANDING]: undefined;
  [homeNavigations.SCHEDULE_MAIN]: undefined;
  [homeNavigations.SCHEDULE_ADD]: undefined;
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
      }}
    >
      <Stack.Screen
        name={homeNavigations.SCHEDULE_MAIN}
        component={ScheduleMainScreen}
        options={({ navigation }) => ({
          headerTitle: '경조사 일정 관리',
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate(homeNavigations.SCHEDULE_ADD)}
              style={{ marginRight: 15 }}
            >
              <Icon2 name="add" size={24} color={colors.BLACK} />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen 
        name={homeNavigations.SCHEDULE_ADD}
        component={ScheduleAddScreen}
        options={{
          headerTitle: '경조사 일정 추가',
        }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({});

export default HomeStackNavigator;
