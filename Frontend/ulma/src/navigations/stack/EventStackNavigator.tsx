import {eventNavigations} from '@/constants/navigations';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {colors} from '@/constants';
import Icon from 'react-native-vector-icons/Entypo';
import EventAddScreen from '@/screens/Events/EventAddScreen';
import EventScreen from '@/screens/Events/EventScreen';
import EventDetailScreen from '@/screens/Events/EventDetailScreen';
import AIRecommendMessage from '@/screens/Events/AIRecommendMessage';
import EventFixScreen from '@/screens/Events/EventFixScreen';

export type eventStackParamList = {
  [eventNavigations.EVENT_ADD]: undefined;
  [eventNavigations.EVENT]: undefined;
  [eventNavigations.EVENT_COMMENT]: undefined;
  [eventNavigations.EVENT_COMMENT_RESULT]: undefined;
  [eventNavigations.EVENT_DETAIL]: {event_id: string}; // 이벤트 상세 내역
  [eventNavigations.AI_RECOMMEND_MESSAGE]: undefined; // AI 추천 메세지
  [eventNavigations.EVENT_FIX]: {eventId: string}; // 수정 페이지에 eventId 전달
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
      <Stack.Screen
        name={eventNavigations.EVENT_DETAIL}
        component={EventDetailScreen}
        options={{
          headerTitle: '이벤트 상세 내역',
        }}
      />
      <Stack.Screen
        name={eventNavigations.AI_RECOMMEND_MESSAGE}
        component={AIRecommendMessage}
        options={{
          headerTitle: 'AI 추천 메세지',
        }}
      />
    </Stack.Navigator>
  );
}

export default EventStackNavigator;
