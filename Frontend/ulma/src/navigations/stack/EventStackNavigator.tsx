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
import AccounthistoryScreen from '@/screens/Events/AccounthistoryScreen';
import FriendsearchScreen from '@/screens/Events/FriendsearchScreen';
export type eventStackParamList = {
  [eventNavigations.EVENT_ADD]: undefined;
  [eventNavigations.EVENT]: undefined;
  [eventNavigations.EVENT_COMMENT]: undefined;
  [eventNavigations.EVENT_COMMENT_RESULT]: undefined;
  [eventNavigations.EVENT_DETAIL]: {event_id: string}; // 이벤트 상세 내역에 대한 타입
  [eventNavigations.EVENT_FIX]: {event_id: string}; // event_id를 사용한 타입 정의
  [eventNavigations.AI_RECOMMEND_MESSAGE]: undefined; // AI 추천 메시지
  [eventNavigations.ACCOUNT_HISTORY]: undefined;
  [eventNavigations.FRIEND_SEARCH]: undefined;
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
        headerTitleAlign: 'left',
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: 'bold',
        },
        headerTintColor: colors.BLACK,
      }}>
      <Stack.Screen
        name={eventNavigations.EVENT}
        component={EventScreen}
        options={{
          headerTitle: '내 경조사 관리',
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
      {/* EventFixScreen 추가 */}
      <Stack.Screen
        name={eventNavigations.EVENT_FIX}
        component={EventFixScreen}
        options={{
          headerTitle: '이벤트 수정하기',
        }}
      />
      <Stack.Screen
        name={eventNavigations.ACCOUNT_HISTORY}
        component={AccounthistoryScreen}
        options={{
          headerTitle: '계좌 이력 불러오기',
        }}
      />
      <Stack.Screen
        name={eventNavigations.FRIEND_SEARCH}
        component={FriendsearchScreen}
        options={{
          headerTitle: '송금 내역 등록하기',
        }}
      />
    </Stack.Navigator>
  );
}

export default EventStackNavigator;
