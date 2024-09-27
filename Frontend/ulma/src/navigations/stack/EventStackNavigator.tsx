import {eventNavigations} from '@/constants/navigations';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {StyleSheet, View} from 'react-native';

import {colors} from '@/constants';
import Icon from 'react-native-vector-icons/Entypo';
import EventAddScreen from '@/screens/Events/EventAddScreen';
import EventDateScreen from '@/screens/Events/EventDateScreen';
import EventScreen from '@/screens/Events/EventScreen';
import EventCommentResult from '@/screens/Events/EventCommentResult';

export type eventStackParamList = {
  [eventNavigations.EVENT_ADD]: undefined;
  [eventNavigations.EVENT_DATE]: undefined;
  [eventNavigations.EVENT]: undefined;
  [eventNavigations.EVENT_COMMENT]: undefined;
  [eventNavigations.EVENT_COMMENT_RESULT]: undefined;
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
        name={eventNavigations.EVENT_COMMENT_RESULT}
        component={EventCommentResult}
        options={{
          headerTitle: '경조사 멘트 추천',
        }}
      />
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
      <Stack.Screen
        name={eventNavigations.EVENT_DATE}
        component={EventDateScreen}
        options={{
          headerTitle: '이벤트 추가하기',
        }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({});

export default EventStackNavigator;
