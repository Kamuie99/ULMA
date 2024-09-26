import {eventNavigations} from '@/constants/navigations';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {StyleSheet} from 'react-native';

import {colors} from '@/constants';
import Icon from 'react-native-vector-icons/Entypo';
import EventAddScreen from '@/screens/Events/EventAddScreen';
import EventScreen from '@/screens/Events/EventScreen';

export type eventStackParamList = {
  [eventNavigations.EVENT_ADD]: undefined;
  [eventNavigations.EVENT]: undefined;
};

const Stack = createStackNavigator<eventStackParamList>();

function EventStackNavigator() {
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
      <Stack.Screen
        name={eventNavigations.EVENT}
        component={EventScreen}
        options={{
          headerTitle: ' ',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={eventNavigations.EVENT_ADD}
        component={EventAddScreen}
        options={{
          headerTitle: '이벤트 추가하기',
          headerBackImage: () => {
            return <Icon name="cross" size={24} color={colors.BLACK} />;
          },
        }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({});

export default EventStackNavigator;
