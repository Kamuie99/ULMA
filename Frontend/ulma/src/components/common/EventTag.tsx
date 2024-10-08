import {colors} from '@/constants';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

// type Label = '결혼' | '생일' | '돌잔치' | '장례식' | '기타';
type Label = string;

interface EventTagProps {
  label: Label;
}

function EventTag({label}: EventTagProps) {
  return (
    <View style={styles.container}>
      <Text style={[styles.text, styles[label]]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  text: {
    backgroundColor: colors.GRAY_300,
    paddingVertical: 4,
    paddingHorizontal: 7,
    borderRadius: 12,
    fontWeight: 'bold',
    color: colors.BLACK,
    alignItems: 'center',
    justifyContent: 'center',
  },
  결혼: {
    backgroundColor: colors.LIGHTPINK,
    paddingHorizontal: 10,
  },
  돌잔치: {
    backgroundColor: colors.BLUE,
  },
  장례식: {
    backgroundColor: colors.BLACK,
    color: colors.WHITE,
  },
  생일: {
    backgroundColor: colors.YELLOW,
    paddingHorizontal: 10,
  },
  // 기타: {
  //   paddingHorizontal: 10,
  // },
});

export default EventTag;
