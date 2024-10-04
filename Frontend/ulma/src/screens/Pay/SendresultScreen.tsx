import CustomButton from '@/components/common/CustomButton';
import {colors} from '@/constants';
import usePayStore from '@/store/usePayStore';
import {useFocusEffect, useRoute} from '@react-navigation/native';
import React, {useCallback, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';

function SendresultScreen({navigation}) {
  useEffect(() => {
    // 페이지에 들어올 때 탭바 숨기기
    navigation.getParent()?.setOptions({
      tabBarStyle: {display: 'none'},
    });
  }, [navigation]);

  const route = useRoute();
  const {balance} = usePayStore();
  const {amount} = route.params as {amount: string};

  return (
    <View style={styles.container}>
      {/* Transfer Details */}
      <View style={styles.resultContainer}>
        {/* <Text style={styles.resultTitle}>송금 결과</Text> */}
        {/* 
        <View style={styles.detailRow}>
          <Text style={styles.label}>송금 계좌</Text>
          <Text style={styles.value}>{accountNumber}</Text>
        </View> */}

        <View style={styles.detailRow}>
          <Text style={styles.label}>송금 금액</Text>
          <Text style={styles.value}>{amount} 원</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>송금 후 잔액</Text>
          <Text style={styles.value}>{balance}</Text>
        </View>

        <Text style={styles.successMessage}>
          {'\n        송금이 성공적으로 완료되었습니다.\n        '}
        </Text>
      </View>

      {/* Confirm Button */}
      <CustomButton variant="outlined" label="확인" />
    </View>
  );
}

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
    backgroundColor: colors.LIGHTGRAY,
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 20,
    marginVertical: 10,
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
    color: colors.GRAY_700,
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
    color: colors.PINK,
    fontSize: 15,
    fontWeight: '800',
    marginTop: 10,
  },
});

export default SendresultScreen;
