//충전결과확인
import React, {useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useRoute} from '@react-navigation/native';
import CustomButton from '@/components/common/CustomButton';
import {colors} from '@/constants';
import {payNavigations} from '@/constants/navigations';
import usePayStore from '@/store/usePayStore';

function ChangeresultScreen({navigation}) {
  const route = useRoute();
  const {amount} = route.params as {amount: string};
  const {accountNumber, balance} = usePayStore();

  return (
    <View style={styles.container}>
      {/* Transfer Details */}
      <View style={styles.resultContainer}>
        <View style={styles.detailRow}>
          <Text style={styles.label}>충전 계좌</Text>
          <Text style={styles.value}>{accountNumber}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>충전 금액</Text>
          <Text style={styles.value}>{amount} 원</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>충전 후 잔액</Text>
          <Text style={styles.value}>{balance}</Text>
        </View>

        <Text style={styles.successMessage}>
          {'\n        충전이 성공적으로 완료되었습니다.\n        '}
        </Text>
      </View>

      {/* Confirm Button */}
      <CustomButton
        label="확인"
        posY={20}
        onPress={() => navigation.navigate(payNavigations.HOME)}
      />
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

export default ChangeresultScreen;
