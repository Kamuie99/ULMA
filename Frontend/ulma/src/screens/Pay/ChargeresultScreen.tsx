//충전결과확인
import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';

const RechargeResult = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {amount} = route.params as {amount: string};

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Pay 충전하기</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.label}>충전 결과</Text>
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>충전 계좌</Text>
          <Text style={styles.infoText}>000-1111-00-1111</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>충전 금액</Text>
          <Text style={styles.infoText}>
            {Number(amount).toLocaleString()} 원
          </Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>충전 후 잔액</Text>
          <Text style={styles.infoText}>354,000 원</Text>
        </View>

        <Text style={styles.successText}>
          충전이 성공적으로 완료되었습니다.
        </Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>확인</Text>
      </TouchableOpacity>
    </View>
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
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#666',
  },
  successText: {
    marginTop: 20,
    fontSize: 16,
    color: '#FF6F61',
    textAlign: 'center',
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

export default RechargeResult;
