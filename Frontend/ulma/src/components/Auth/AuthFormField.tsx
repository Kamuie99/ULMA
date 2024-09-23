import React from 'react';
import {StyleSheet, View} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';

import {colors} from '@/constants';

interface AuthFormFieldProps {
  label: string;
}

function AuthFormField({label}: AuthFormFieldProps) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={label}
        placeholderTextColor={colors.GRAY}></TextInput>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  input: {
    height: 40,
    backgroundColor: colors.LIGHTGRAY,
    width: '90%',
  },
});

export default AuthFormField;
