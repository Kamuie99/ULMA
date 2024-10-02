import axiosInstance from '@/api/axios';
import {colors} from '@/constants';
import useAuthStore from '@/store/useAuthStore';
import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';

function PayHomeScreen() {
  const {accessToken} = useAuthStore();
  const payMoney = 100;
  const bank = '하나은행';
  const account = '351468468**';

  // useFocusEffect(
  //   useCallback(() => {
  //     const fetchRecentSchedule = async () => {
  //       try {
  //         const response = await axiosInstance.get('/users/{user_id}/pay/balance', {
  //           headers: {
  //             Authorization: `Bearer ${accessToken}`,
  //           },
  //         });
  //         console.log(response.data); // API에서 받은 데이터로 상태 업데이트
  //       } catch (error) {
  //         console.error('일정 목록을 불러오는 중 오류 발생:', error);
  //         console.log(accessToken);
  //       }
  //     };

  //     fetchRecentSchedule();
  //   }, []),

  return (
    <View style={styles.container}>
      <View style={styles.boxContainer}>
        <View style={styles.boxHeader}>
          <Text style={styles.title}>페이머니</Text>
          <Image
            source={require(`../../assets/Pay/banks/${bank}.png`)}
            style={styles.bankImage}
          />
          <Text style={styles.accountText}>{account}</Text>
          <Text style={styles.balance}>{payMoney}원</Text>
        </View>
      </View>
      <View style={styles.line} />
      <View style={styles.boxContainer}>
        <Text style={styles.title}>Pay 설정</Text>
        <View style={styles.buttonContainer}>
          <View>
            <Image
              source={require('@/assets/Pay/menu/accountInfo.png')}
              style={styles.buttonImage}
            />
            <Text>연결 계좌 정보</Text>
          </View>
          <Text>연결 계좌 수정</Text>
          <Text>연결 계좌 삭제</Text>
          <Text>송금하기</Text>
          <Text>Pay 충전하기</Text>
        </View>
      </View>
      <View style={styles.line} />
      <View style={styles.boxContainer}>
        <Text style={styles.title}>Pay 이력 전체보기</Text>
        <View style={styles.historyContainer}>
          <Text>내역 1</Text>
          <Text>내역 1</Text>
          <Text>내역 1</Text>
          <Text>내역 1</Text>
          <Text>내역 1</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.LIGHTGRAY,
    overflow: 'scroll',
    padding: 15,
  },
  boxContainer: {
    backgroundColor: colors.WHITE,
    borderRadius: 15,
    padding: 20,
  },
  line: {
    borderBottomWidth: 1,
    borderBottomColor: colors.GRAY_300,
    marginVertical: 20,
  },
  title: {
    fontWeight: 'bold',
    color: colors.BLACK,
    marginBottom: 10,
  },
  boxHeader: {
    // backgroundColor: colors.LIGHTPINK,
  },
  bankImage: {
    resizeMode: 'contain',
    height: 20,
    width: 100,
  },
  accountText: {
    fontSize: 16,
  },
  balance: {
    fontSize: 22,
    textAlign: 'right',
    color: colors.BLACK,
  },
  buttonContainer: {
    backgroundColor: colors.LIGHTPINK,
  },
  buttonImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginHorizontal: 10,
  },
  historyContainer: {
    backgroundColor: colors.LIGHTPINK,
  },
});

export default PayHomeScreen;
