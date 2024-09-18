/* eslint-disable prettier/prettier */
import React, {ForwardedRef, forwardRef, useRef, useState} from 'react';
import {
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';

import {colors} from '@/constants';

interface InputFieldProps extends TextInputProps {
  disabled?: boolean;
  error?: string;
  touched?: boolean;
}

const deviceHeight = Dimensions.get('screen').height;

const [text, onChangeText] = useState('');

const InputField = forwardRef(
  ({disabled = false, ...props}: InputFieldProps) => {
    const innerRef = useRef<TextInput | null>(null);

    const handlePressInput = () => {
      innerRef.current?.focus();
    };

    return (
      <Pressable onPress={handlePressInput}>
        <View style={styles.container}>
          <TextInput
            style={[styles.input, disabled && styles.disabled]}
            placeholderTextColor={colors.GRAY}
            value={text}
            onChangeText={onChangeText}
            spellCheck={false}
            autoCorrect={false}
          />
        </View>
      </Pressable>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: colors.GREEN_700,
    height: 20,
  },
  input: {
    color: 'black',
    padding: 10,
    fontSize: 15,
  },
  disabled: {
    backgroundColor: colors.GRAY,
    color: colors.GRAY,
  },
});

export default InputField;
