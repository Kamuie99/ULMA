import {mypageNavigations, friendsNavigations} from '@/constants/navigations';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';

import {colors} from '@/constants';
import Icon from 'react-native-vector-icons/Entypo';
import UserDetailScreen from '@/screens/MyPage/UserDetailScreen';
import MyPageHomeScreen from '@/screens/MyPage/MyPageHomeScreen';
import FriendsListScreen from '@/screens/Freinds/FriendsListScreen';
import FriendsAddScreen from '@/screens/Freinds/FriendsAddScreen';

export type mypageStackParamList = {
  [mypageNavigations.MYPAGE_HOME]: undefined;
  [mypageNavigations.USER_DETAIL]: undefined;
  [friendsNavigations.FRIENDS_LIST]: undefined; // 지인 목록 조회
  [friendsNavigations.FRIENDS_ADD]: undefined; // 지인 신규등록
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
          backgroundColor: '#F8F8F8',
        },
        headerTitleAlign: 'left', // Align title to the left
        headerTitleStyle: {
          fontSize: 18, // Adjust font size to match style
          fontWeight: 'bold',
        },
        headerTintColor: colors.BLACK,
      }}>
      <Stack.Screen
        name={mypageNavigations.MYPAGE_HOME}
        component={MyPageHomeScreen}
        options={({navigation}) => ({
          headerTitle: '더보기',
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {
                // Add action for gear icon press here
              }}
              style={{ marginRight: 15 }}>
              <Icon name="cog" size={24} color={colors.BLACK} />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name={mypageNavigations.USER_DETAIL}
        component={UserDetailScreen}
        options={{
          headerTitle: '사용자 정보',
        }}
      />
      <Stack.Screen
        name={friendsNavigations.FRIENDS_LIST}
        component={FriendsListScreen}
        options={{
          headerTitle: '지인 목록',
        }}
      />
      <Stack.Screen
        name={friendsNavigations.FRIENDS_ADD}
        component={FriendsAddScreen}
        options={{
          headerTitle: '지인 추가',
        }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({});

export default MyPageStackNavigator;
