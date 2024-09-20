import {settingNavigations} from '@/constants/navigations';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {StyleSheet, View} from 'react-native';

import {colors} from '@/constants';
import Icon from 'react-native-vector-icons/Entypo';
import SettingHomeScreen from '@/screens/Setting/SettingHomeScreen';

export type settingStackParamList = {
  [settingNavigations.SETTING_HOME]: undefined;
};

const Stack = createStackNavigator<settingStackParamList>();

function SettingStackNavigator() {
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
        name={settingNavigations.SETTING_HOME}
        component={SettingHomeScreen}
        options={{
          headerTitle: ' ',
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({});

export default SettingStackNavigator;
