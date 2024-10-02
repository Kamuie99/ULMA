import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons'; // Ionicons를 사용할 경우
import HomeStackNavigator from '../stack/HomeStackNavigator';
import PayStackNavigator from '../stack/PayStackNavigator';
import EventStackNavigator from '../stack/EventStackNavigator';
import MyPageStackNavigator from '../stack/MyPageStackNavigator';
import FriendsStackNavigator from '../stack/FriendsStackNavigator';
import {colors} from '@/constants';

const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.GREEN_700,
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          // 탭 이름에 따라 아이콘 이름 설정
          if (route.name === 'Home') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Pay') {
            iconName = focused ? 'wallet' : 'wallet-outline';
          } else if (route.name === 'Friends') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Event') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'MyPage') {
            iconName = focused ? 'apps' : 'apps-outline';
          }

          // Icon 컴포넌트 반환
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarStyle: {
          paddingTop: 10, // 상단 여백 설정
          height: 60, // 탭 바의 높이 조정 (필요한 경우)
        },
        tabBarLabel: '' // 탭 레이블을 빈 문자열로 설정하여 이름을 숨깁니다.
      })}>
      <Tab.Screen name="Home" component={HomeStackNavigator} />
      <Tab.Screen name="Friends" component={FriendsStackNavigator} />
      <Tab.Screen name="Pay" component={PayStackNavigator} />
      <Tab.Screen name="Event" component={EventStackNavigator} />
      <Tab.Screen name="MyPage" component={MyPageStackNavigator} />
    </Tab.Navigator>
  );
}

export default TabNavigator;
