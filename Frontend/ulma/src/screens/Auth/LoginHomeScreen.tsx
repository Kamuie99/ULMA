import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import CustomButton from '@/components/common/CustomButton';
import {AuthStackParamList} from '@/navigations/stack/AuthStackNavigator';
import {authNavigations} from '@/constants/navigations';
import {StackScreenProps} from '@react-navigation/stack';
import TitleTextField from '@/components/common/TitleTextField';
import {colors} from '@/constants';

type LoginHomeScreenProps = StackScreenProps<
  AuthStackParamList,
  typeof authNavigations.LOGIN_HOME
>;

function LoginHomeScreen({navigation}: LoginHomeScreenProps) {
  return (
    <View style={styles.container}>
      <TitleTextField frontLabel="반가워요!" />
      <Text style={styles.title}>나만의 경조사비 관리 비서</Text>
      <View style={styles.titleContainer}>
        <Text style={styles.title3}>ULMA</Text>
        <Text style={styles.title2}> 입니다.</Text>
      </View>
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.LIGHTGRAY,
    flex: 1,
  },
  title: {
    fontSize: 20,
    marginLeft: 20,
  },
  title2: {
    fontSize: 20,
  },
  title3: {
    fontSize: 20,
    marginLeft: 20,
    color: colors.GREEN_700,
  },
  titleContainer: {
    flexDirection: 'row',
  },
});

export default LoginHomeScreen;
