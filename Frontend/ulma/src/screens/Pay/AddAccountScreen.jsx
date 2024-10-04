import CustomButton from '@/components/common/CustomButton';
import InputField from '@/components/common/InputField';
import React from 'react';
import {StyleSheet, View} from 'react-native';

function AddAccountScreen() {
  const [account, setAccount] = React.useState('');
  return (
    <View style={styles.container}>
      <InputField value={account} />
      <CustomButton label="추가하기" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default AddAccountScreen;
