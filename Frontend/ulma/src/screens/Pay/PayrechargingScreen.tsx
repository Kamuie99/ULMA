import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import CustomButton from '@/components/common/CustomButton';
import {payNavigations} from '@/constants/navigations';
import {colors} from '@/constants';

function PayrechargingScreen({navigation}) {
  useEffect(() => {
    // 페이지에 들어올 때 탭바 숨기기
    navigation.getParent()?.setOptions({
      tabBarStyle: {display: 'none'},
    });
  }, [navigation]);
  const [amount, setAmount] = useState<string>('300000'); // 초기값 300,000원 (사용자가 입력 가능)

  const handleRecharge = () => {
    // amount를 파라미터로 전달
    navigation.navigate(payNavigations.CHARGER_RESULT, {amount});
  };

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
          <Text style={styles.infoText}>000-1111-00-1111</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>충전 후 잔액</Text>
          <Text style={styles.infoText}>
            {Number(amount).toLocaleString()} 원
          </Text>
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
