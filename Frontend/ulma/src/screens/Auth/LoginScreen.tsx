import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import InputField from '@/components/common/InputField';

function LoginScreen() {
  return (
    <View>
      <InputField placeholder="비밀번호" />
    </View>
  );
}

const styles = StyleSheet.create({});

export default LoginScreen;
