/* eslint-disable prettier/prettier */
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors} from '@/constants';

interface TitleTextFieldProps {
  frontLabel: string;
  emphMsg?: string;
  backLabel?: string;
}

function TitleTextField({frontLabel, emphMsg, backLabel}: TitleTextFieldProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{frontLabel}</Text>
      <Text style={styles.emphText}>{emphMsg}</Text>
      <Text style={styles.text}>{backLabel}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginLeft: '5%',
    marginTop: 50,
    marginBottom: 20,
  },
  text: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.BLACK,
  },
  emphText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.GREEN_700,
  },
});

export default TitleTextField;
