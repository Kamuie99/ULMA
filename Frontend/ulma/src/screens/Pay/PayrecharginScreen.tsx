import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const PayrechargingScreen = () => {
  const [amount, setAmount] = useState<string>('300000'); // 초기값 300,000원 (사용자가 입력 가능)

  // <any>를 사용하여 navigate의 파라미터 문제를 해결
  const navigation = useNavigation<any>();

  const handleRecharge = () => {
    // amount를 파라미터로 전달
    navigation.navigate('RechargeResult', {amount});
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View style={styles.header}>
        <Text style={styles.headerText}>Pay 충전하기</Text>
      </View>

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

      <TouchableOpacity style={styles.button} onPress={handleRecharge}>
        <Text style={styles.buttonText}>충전하기</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  amountContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#00C77F',
    marginBottom: 20,
  },
  input: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
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
    color: '#666',
  },
  button: {
    backgroundColor: '#00C77F',
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default PayrechargingScreen;
