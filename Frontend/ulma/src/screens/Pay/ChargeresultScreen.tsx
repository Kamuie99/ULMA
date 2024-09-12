// 충전결과 페이지
import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const PayRechargePage = () => {
  const [amount, setAmount] = useState<string>(''); // 충전 금액
  const navigation = useNavigation();

  // 금액 입력 핸들러 (숫자만 입력 가능)
  const handleAmountChange = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, ''); // 숫자 이외의 문자 제거
    setAmount(numericValue);
  };

  // 충전하기 버튼 클릭 핸들러
  const handleRecharge = () => {
    // 충전 로직 구현
    console.log(`충전 금액: ${amount}`);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>뒤로가기</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Pay 충전하기</Text>

      <View style={styles.rechargeBox}>
        <View style={styles.amountRow}>
          <Text style={styles.label}>충전 금액</Text>
          <View style={styles.amountInputContainer}>
            <TextInput
              style={styles.amountInput}
              placeholder="0"
              placeholderTextColor="#BDBDBD"
              value={amount}
              keyboardType="numeric"
              onChangeText={handleAmountChange}
            />
            <Text style={styles.currencyText}>원</Text>
          </View>
        </View>

        <Text style={styles.infoText}>충전 계좌: 000-1111-00-1111</Text>
        <Text style={styles.infoText}>충전 후 잔액: 354,000 원</Text>
      </View>

      <TouchableOpacity style={styles.rechargeButton} onPress={handleRecharge}>
        <Text style={styles.rechargeButtonText}>충전하기</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  backButton: {
    marginBottom: 20,
  },
  backText: {
    fontSize: 16,
    color: '#00C77F',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  rechargeBox: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 20,
    marginBottom: 30,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#333',
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#00C77F',
  },
  amountInput: {
    fontSize: 24,
    color: '#000',
    paddingVertical: 5,
    textAlign: 'right',
    width: 120, // 금액 입력 필드의 너비
  },
  currencyText: {
    fontSize: 18,
    color: '#000',
    marginLeft: 5,
  },
  infoText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  rechargeButton: {
    backgroundColor: '#00C77F',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  rechargeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PayRechargePage;
