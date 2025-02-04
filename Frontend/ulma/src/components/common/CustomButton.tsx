import React from 'react';
import {
  Dimensions,
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';

import {colors} from '@/constants';

interface CustomButtonProps extends PressableProps {
  label: string;
  variant?: 'filled' | 'outlined';
  size?: 'large' | 'full' | 'maxSize';
  inValid?: boolean;
  customStyle?: StyleProp<ViewStyle>;
  posY?: number;
}

const deviceHeight = Dimensions.get('screen').height;
const deviceWidth = Dimensions.get('screen').width;

function CustomButton({
  label,
  variant = 'filled',
  size = 'maxSize',
  inValid = false,
  customStyle,
  posY = 0,
  ...props
}: CustomButtonProps) {
  return (
    <View style={[styles.wrap, {bottom: posY}]}>
      <Pressable
        disabled={inValid}
        style={({pressed}) => [
          styles.container,
          pressed ? styles[`${variant}Pressed`] : styles[variant],
          inValid && styles.inValid,
          customStyle ? customStyle : null,
          size === 'full' && {borderRadius: 0}, // full일 때 borderRadius 없애기
        ]}
        {...props}>
        <View style={styles[size]}>
          <Text style={[styles.text, styles[`${variant}Text`]]}>{label}</Text>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: deviceWidth,
    paddingHorizontal: 10,
  },
  container: {
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'center',
    display: 'flex',
    alignItems: 'center',
  },
  inValid: {
    opacity: 0.5,
  },
  filled: {
    backgroundColor: colors.GREEN_700,
  },
  outlined: {
    backgroundColor: colors.GREEN_300,
  },
  filledPressed: {
    backgroundColor: colors.GREEN_300,
  },
  outlinedPressed: {
    backgroundColor: colors.GREEN_300,
    opacity: 0.5,
  },
  maxSize: {
    width: '100%',
    paddingVertical: deviceHeight > 700 ? 16 : 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  large: {
    width: '90%',
    paddingVertical: deviceHeight > 700 ? 16 : 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  full: {
    width: deviceWidth + 20,
    paddingVertical: deviceHeight > 700 ? 16 : 10,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    paddingLeft: 20,
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
  },
  filledText: {
    color: colors.WHITE,
  },
  outlinedText: {
    color: colors.GREEN_700,
  },
});

export default CustomButton;
