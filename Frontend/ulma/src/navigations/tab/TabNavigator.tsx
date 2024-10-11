import React, {useEffect, useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons'; // Ionicons를 사용할 경우
import {Keyboard} from 'react-native'; // 추가
import HomeStackNavigator from '../stack/HomeStackNavigator';
import PayStackNavigator from '../stack/PayStackNavigator';
import EventStackNavigator from '../stack/EventStackNavigator';
import MyPageStackNavigator from '../stack/MyPageStackNavigator';
import FriendsStackNavigator from '../stack/FriendsStackNavigator';
import {colors} from '@/constants';

const Tab = createBottomTabNavigator();

function TabNavigator() {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    // 키보드가 열릴 때
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      },
    );
    // 키보드가 닫힐 때
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.GREEN_700,
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Pay') {
            iconName = focused ? 'wallet' : 'wallet-outline';
          } else if (route.name === 'Friends') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Event') {
            iconName = focused ? 'balloon' : 'balloon-outline';
          } else if (route.name === 'MyPage') {
            iconName = focused ? 'apps' : 'apps-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarStyle: {
          paddingTop: 10,
          height: isKeyboardVisible ? 0 : 60, // 키보드가 열릴 때 높이를 0으로 설정
          display: isKeyboardVisible ? 'none' : 'flex', // 키보드가 열릴 때 TabBar 숨기기
        },
        tabBarLabel: '',
      })}>
      <Tab.Screen name="Home" component={HomeStackNavigator} />
      <Tab.Screen name="Event" component={EventStackNavigator} />
      <Tab.Screen name="Friends" component={FriendsStackNavigator} />
      <Tab.Screen name="Pay" component={PayStackNavigator} />
      <Tab.Screen name="MyPage" component={MyPageStackNavigator} />
    </Tab.Navigator>
  );
}

export default TabNavigator;
