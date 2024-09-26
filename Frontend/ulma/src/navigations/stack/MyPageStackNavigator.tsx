import {mypageNavigations} from '@/constants/navigations';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {StyleSheet, View} from 'react-native';

import {colors} from '@/constants';
import Icon from 'react-native-vector-icons/Entypo';
import UserDetailScreen from '@/screens/MyPage/UserDetailScreen';
import MyPageHomeScreen from '@/screens/MyPage/MyPageHomeScreen';

export type mypageStackParamList = {
  [mypageNavigations.MYPAGE_HOME]: undefined;
  [mypageNavigations.USER_DETAIL]: undefined;
};

const Stack = createStackNavigator<mypageStackParamList>();

function MyPageStackNavigator() {
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
        name={mypageNavigations.MYPAGE_HOME}
        component={MyPageHomeScreen}
        options={{
          headerTitle: ' ',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={mypageNavigations.USER_DETAIL}
        component={UserDetailScreen}
        options={{
          headerTitle: ' ',
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({});

export default MyPageStackNavigator;
