import React from 'react';
import {StyleSheet, View} from 'react-native';
import TitleTextField from '@/components/common/TitleTextField';
import AuthFormField from '@/components/Auth/AuthFormField';

interface SignupScreenProps {}

function SignupScreen({}: SignupScreenProps) {
  return (
    <View>
      <TitleTextField frontLabel="휴대폰 본인 확인이 필요합니다." />
      <AuthFormField label="이름" />
      <AuthFormField label="생년월일" />
      <AuthFormField label="통신사" />
      <AuthFormField label="휴대폰 번호" />
    </View>
  );
}

const styles = StyleSheet.create({});

export default SignupScreen;
