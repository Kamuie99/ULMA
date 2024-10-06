import React from 'react';
import { friendsNavigations } from '@/constants/navigations';
import {createStackNavigator} from '@react-navigation/stack';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {colors} from '@/constants';
import Icon from 'react-native-vector-icons/Ionicons';

import FriendsListScreen from '@/screens/Freinds/FriendsListScreen';
import FriendsHomeScreen from '@/screens/Freinds/FriendsHomeScreen';
import FriendsAddScreen from '@/screens/Freinds/FriendsAddScreen';
import FriendsDetailScreen from '@/screens/Freinds/FriendsDeatilScreen';

export type freindsStackParamList = {
  [friendsNavigations.FRIENDS_HOME]: undefined;
  [friendsNavigations.FRIENDS_LIST]: undefined;
  [friendsNavigations.FRIENDS_ADD]: undefined;
  [friendsNavigations.FREINDS_DETAIL]: { guestId: number }; // guestId를 받아오는 상세 페이지
};

const Stack = createStackNavigator<freindsStackParamList>();

function FriendsStackNavigator() {
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
        name={friendsNavigations.FRIENDS_LIST}
        component={FriendsListScreen}
        options={({ navigation }) => ({
          headerTitle: '지인 목록',
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate(friendsNavigations.FRIENDS_ADD)}
              style={{ marginRight: 15 }}
            >
              <Icon name="add" size={24} color={colors.BLACK} />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name={friendsNavigations.FRIENDS_HOME}
        component={FriendsHomeScreen}
        options={{
          headerTitle: '지인 관리',
        }}
      />
      <Stack.Screen
        name={friendsNavigations.FRIENDS_ADD}
        component={FriendsAddScreen}
        options={{
          headerTitle: '지인 추가',
        }}
      />
      <Stack.Screen
        name={friendsNavigations.FREINDS_DETAIL}
        component={FriendsDetailScreen}
        options={{
          headerTitle: '거래내역 조회',
        }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({});

export default FriendsStackNavigator;
