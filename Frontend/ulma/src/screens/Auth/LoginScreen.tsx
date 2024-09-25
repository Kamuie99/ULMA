import CustomButton from '@/components/common/CustomButton';
import InputField from '@/components/common/InputField';
import TitleTextField from '@/components/common/TitleTextField';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

function LoginScreen() {
  return (
    <View style={styles.container}>
      <TitleTextField frontLabel="아이디를 입력해주세요." />
      <InputField />
      <TitleTextField frontLabel="비밀번호를 입력해주세요." />
      <InputField />
      <CustomButton label="로그인 하기" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default LoginScreen;
