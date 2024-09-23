import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

const SendresultScreen = () => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pay 송금하기</Text>
      </View>

      {/* Transfer Details */}
      <View style={styles.resultContainer}>
        <Text style={styles.resultTitle}>송금 결과</Text>

        <View style={styles.detailRow}>
          <Text style={styles.label}>송금 계좌</Text>
          <Text style={styles.value}>000-1111-00-1111</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>송금 금액</Text>
          <Text style={styles.value}>300,000 원</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>송금 후 잔액</Text>
          <Text style={styles.value}>54,000 원</Text>
        </View>

        <Text style={styles.successMessage}>
          {'\n        송금이 성공적으로 완료되었습니다.\n        '}
        </Text>
      </View>

      {/* Confirm Button */}
      <TouchableOpacity style={styles.confirmButton}>
        <Text style={styles.confirmText}>확인</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'space-between',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  headerTitle: {
    color: 'black',
    fontSize: 14,
    fontFamily: 'Inter',
    fontWeight: '700',
  },
  resultContainer: {
    backgroundColor: '#F7F8FA',
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 20,
  },
  resultTitle: {
    color: 'black',
    fontSize: 15,
    fontFamily: 'SamsungGothicCondensed',
    fontWeight: '400',
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    color: '#A7A7A7',
    fontSize: 15,
    fontFamily: 'SamsungGothicCondensedOTF',
    fontWeight: '500',
  },
  value: {
    color: 'black',
    fontSize: 15,
    fontFamily: 'SamsungGothicCondensedOTF',
    fontWeight: '500',
  },
  successMessage: {
    textAlign: 'center',
    color: '#F09AAA',
    fontSize: 14,
    fontFamily: 'SamsungGothicCondensed',
    fontWeight: '400',
    marginTop: 20,
  },
  confirmButton: {
    backgroundColor: '#C2EADF',
    borderRadius: 8,
    paddingVertical: 15,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  confirmText: {
    color: '#3FC89E',
    fontSize: 14,
    fontFamily: 'SamsungGothicCondensed',
    fontWeight: '400',
  },
});

export default SendresultScreen;
