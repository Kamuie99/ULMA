import {colors} from '@/constants';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

// type Label = '가족' | '친척' | '친구' | '직장' | '지인' | '기타' | '학교';
type Label = string;

interface FriendTagProps {
  label: Label;
}

function FriendTag({label}: FriendTagProps) {
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
    paddingHorizontal: 5,
    borderRadius: 5,
    fontWeight: 'bold',
    color: colors.BLACK,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 6,
  },
  가족: {
    backgroundColor: colors.PINK,
    paddingHorizontal: 10,
  },
  친척: {
    backgroundColor: colors.PINK,
    paddingHorizontal: 10,
  },
  친구: {
    backgroundColor: colors.GREEN_300,
    paddingHorizontal: 10,
  },
  직장: {
    backgroundColor: colors.PASTEL_BLUE,
    paddingHorizontal: 10,
  },
  지인: {
    backgroundColor: colors.PASTEL_BLUE,
    paddingHorizontal: 10,
  },
  기타: {
    backgroundColor: colors.GRAY_300,
    paddingHorizontal: 10,
  },
  학교: {
    backgroundColor: colors.PURPLE,
    paddingHorizontal: 10,
  },
});

export default FriendTag;
