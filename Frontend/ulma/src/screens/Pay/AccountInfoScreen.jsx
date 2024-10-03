import CustomButton from '@/components/common/CustomButton';
import {colors} from '@/constants';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';

interface AccountInfoScreenProps {}

function AccountInfoScreen({}: AccountInfoScreenProps) {
  return (
    <View style={styles.container}>
      <View style={styles.accountBox}>
        <Text>hi</Text>
        <Text>hi</Text>
        <Text>hi</Text>
      </View>

      <CustomButton label="계좌 추가하기" size="maxSize" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
    padding: 15,
    gap: 10,
  },
  accountBox: {
    backgroundColor: colors.WHITE,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.GRAY_300,
  },
  box: {
    flex: 1,
    backgroundColor: colors.LIGHTGRAY,
    borderRadius: 10,
  },
});

export default AccountInfoScreen;
