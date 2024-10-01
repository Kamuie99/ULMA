import {eventNavigations} from '@/constants/navigations';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {colors} from '@/constants';
import Icon from 'react-native-vector-icons/Entypo';
import EventAddScreen from '@/screens/Events/EventAddScreen';
import EventScreen from '@/screens/Events/EventScreen';
// import EventCommentResult from '@/screens/Events/EventCommentResult';
import EventDetailScreen from '@/screens/Events/EventDetailScreen';

// eventStackParamList 정의
export type eventStackParamList = {
  [eventNavigations.EVENT_ADD]: undefined;
  [eventNavigations.EVENT]: undefined;
  [eventNavigations.EVENT_COMMENT]: undefined;
  [eventNavigations.EVENT_COMMENT_RESULT]: undefined;
  [eventNavigations.EVENT_DETAIL]: {event_id: string}; // EVENT_DETAIL에 event_id 추가
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
      {/* <Stack.Screen
        name={eventNavigations.EVENT_COMMENT_RESULT}
        component={EventCommentResult}
        options={{
          headerTitle: '경조사 멘트 추천',
        }}
      /> */}
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
      {/* EventDetailScreen에 event_id 전달 */}
      <Stack.Screen
        name={eventNavigations.EVENT_DETAIL}
        component={EventDetailScreen}
        options={{
          headerTitle: '이벤트 상세 내역',
        }}
      />
    </Stack.Navigator>
  );
}

export default EventStackNavigator;
