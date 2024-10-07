import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import CustomButton from '@/components/common/CustomButton';
import {payNavigations} from '@/constants/navigations';
import {colors} from '@/constants';
import Toast from 'react-native-toast-message';
import axiosInstance from '@/api/axios';
import useAuthStore from '@/store/useAuthStore';
import usePayStore from '@/store/usePayStore';

function PayrechargingScreen() {
  const [amount, setAmount] = useState<number>(0);
  const {getPayInfo} = usePayStore();

  const handleRecharge = async () => {
    if (amount === 0) {
      Toast.show({text1: '금액이 입력되지 않았어요.', type: 'error'});
      return;
    }
    const accessToken = useAuthStore.getState().accessToken;

    try {
      const response = await axiosInstance.post(
        '/users/pay/balance',
        {
          balance: amount,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      console.log(response.data);
      getPayInfo();
      navigation.navigate(payNavigations.CHARGER_RESULT, {amount});
    } catch (error) {
      console.error('계정 정보를 불러오는 중 에러가 발생했습니다:', error);
    }
  };

  const {balance, accountNumber} = usePayStore();
  const totalAmount = (Number(balance) || 0) + (Number(amount) || 0);

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View style={styles.content}>
        <Text style={styles.label}>충전 금액</Text>
        <View style={styles.amountContainer}>
          <TextInput
            style={styles.input}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric" // 숫자 키보드
            placeholder="0"
            maxLength={10}
          />
          <Text style={styles.currencyText}>원</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>충전 계좌</Text>
          <Text style={styles.infoText}>{accountNumber}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>충전 후 잔액</Text>
          <Text style={styles.infoText}>{totalAmount.toLocaleString()} 원</Text>
        </View>
      </View>
      <CustomButton label="충전하기" onPress={handleRecharge} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  header: {
    marginTop: 50,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
    backgroundColor: colors.LIGHTGRAY,
    borderRadius: 10,
  },
  label: {
    fontSize: 16,
    color: colors.GRAY_700,
    marginBottom: 10,
  },
  amountContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.GREEN_700,
    marginBottom: 20,
  },
  input: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'right',
    flex: 1,
  },
  currencyText: {
    fontSize: 24,
    marginLeft: 10,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  infoText: {
    fontSize: 16,
    color: colors.GRAY_700,
  },
});

export default PayrechargingScreen;
