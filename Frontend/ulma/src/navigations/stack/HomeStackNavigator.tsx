import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '@/constants';
import { homeNavigations } from '@/constants/navigations';

import ScheduleMainScreen from '@/screens/Home/ScheduleMainScreen';
import ScheduleAddScreen from '@/screens/Home/ScheduleAddScreen';
import FriendsListScreen from '@/screens/Freinds/FriendsListScreen';

export type homeStackParamList = {
  [homeNavigations.SCHEDULE_MAIN]: undefined;
  [homeNavigations.SCHEDULE_ADD]: { selectedUser?: { guestId: number; name: string } };
  [homeNavigations.SELECT_FRIEND]: undefined;
};

const Stack = createStackNavigator<homeStackParamList>();

function HomeStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        cardStyle: { backgroundColor: colors.WHITE },
        headerStyle: { backgroundColor: colors.WHITE },
        headerTitleAlign: 'left',
        headerTitleStyle: { fontSize: 18, fontWeight: 'bold' },
        headerTintColor: colors.BLACK,
      }}
    >
      <Stack.Screen
        name={homeNavigations.SCHEDULE_MAIN}
        component={ScheduleMainScreen}
        options={({ navigation }) => ({
          headerTitle: '경조사 일정 관리',
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate(homeNavigations.SCHEDULE_ADD)}
              style={{ marginRight: 15 }}
            >
              <Icon name="add" size={24} color={colors.BLACK} />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen 
        name={homeNavigations.SCHEDULE_ADD}
        component={ScheduleAddScreen}
        options={{
          headerTitle: '경조사 일정 추가',
        }}
      />
      <Stack.Screen
        name={homeNavigations.SELECT_FRIEND}
        component={FriendsListScreen}
        options={{
          headerTitle: '지인 선택',
        }}
      />
    </Stack.Navigator>
  );
}

export default HomeStackNavigator;