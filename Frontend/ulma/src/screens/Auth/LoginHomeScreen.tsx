import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import CustomButton from '@/components/common/CustomButton';
import {AuthStackParamList} from '@/navigations/stack/AuthStackNavigator';
import {authNavigations} from '@/constants/navigations';
import {StackScreenProps} from '@react-navigation/stack';

type LoginHomeScreenProps = StackScreenProps<
  AuthStackParamList,
  typeof authNavigations.LOGIN_HOME
>;

function LoginHomeScreen({navigation}: LoginHomeScreenProps) {
  return (
    <View>
      <CustomButton
        label="로그인 하기"
        onPress={() => navigation.navigate(authNavigations.LOGIN)}
      />
      <Text>혹시 계정이 없으신가요?</Text>
      <Text onPress={() => navigation.navigate(authNavigations.SIGNUP)}>
        회원가입 하러 가기
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({});

export default LoginHomeScreen;
