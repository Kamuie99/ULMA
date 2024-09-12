import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import TitleTextField from '@/components/common/TitleTextField';

function LoginScreen() {
  const EventName = '남자친구 생일';
  return (
    <View>
      <TitleTextField
        frontLabel="AI가 추천하는 "
        emphMsg={EventName}
        backLabel=" 메세지예요."
      />
    </View>
  );
}

const styles = StyleSheet.create({});

export default LoginScreen;
