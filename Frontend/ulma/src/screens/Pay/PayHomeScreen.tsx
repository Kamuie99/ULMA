import axiosInstance from '@/api/axios';
import {colors} from '@/constants';
import Icon from 'react-native-vector-icons/Entypo';
import useAuthStore from '@/store/useAuthStore';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect} from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {payNavigations} from '@/constants/navigations';

function PayHomeScreen() {
  const {accessToken} = useAuthStore();
  const navigation = new useNavigation();
  const payMoney = 0;
  const isHaveAccount = false;
  const bank = '하나은행';
  const account = '351468468**';

  // useFocusEffect(
  //   useCallback(() => {
  //     const fetchBalance = async () => {
  //       try {
  //         const response = await axiosInstance.get('/users/pay/balance', {
  //           headers: {
  //             Authorization: `Bearer ${accessToken}`,
  //           },
  //         });
  //         console.log(response.data);
  //       } catch (error) {
  //         console.error('error:', error);
  //       }
  //     };

  //     fetchBalance();
  //   }, []),
  // );

  // useEffect(() => {
  //   const fetchAccount = async () => {
  //     try {
  //       const response = await axiosInstance.get('/users/account/info', {
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`,
  //         },
  //       });
  //       console.log(response.data);
  //     } catch (error) {
  //       console.error('error:', error);
  //     }
  //   };

  //   fetchAccount();
  // }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.boxContainer}>
        <Text style={styles.title}>페이머니</Text>
        {isHaveAccount ? (
          <>
            <Image
              source={require(`../../assets/Pay/banks/${bank}.png`)}
              style={styles.bankImage}
            />
            <Text style={styles.accountText}>{account}</Text>
            <Text style={styles.balance}>{payMoney}원</Text>
          </>
        ) : (
          <>
            <Text>연결된 페이 서비스가 확인되지 않아요 😯</Text>
            <TouchableOpacity
              style={styles.connectButton}
              onPress={() => {
                navigation.navigate(payNavigations.MAKE_PAY);
              }}>
              <Text style={styles.connectButtonText}>Ulma Pay 시작하기</Text>
              <Icon name="chevron-right" size={24} color={colors.GREEN_700} />
            </TouchableOpacity>
          </>
        )}
      </View>
      <View style={styles.boxContainer}>
        <Text style={styles.title}>Pay 설정</Text>
        <View style={styles.buttonContainer}>
          <View style={styles.button}>
            <Image
              source={require('@/assets/Pay/menu/accountInfo.png')}
              style={styles.buttonImage}
            />
            <Text>계좌 정보</Text>
          </View>
          <View style={styles.button}>
            <Image
              source={require('@/assets/Pay/menu/accountEdit.png')}
              style={styles.buttonImage}
            />
            <Text>계좌 수정</Text>
          </View>
          <View style={styles.button}>
            <Image
              source={require('@/assets/Pay/menu/accountDel.png')}
              style={styles.buttonImage}
            />
            <Text>계좌 삭제</Text>
          </View>
          <View style={styles.button}>
            <Image
              source={require('@/assets/Pay/menu/sendMoney.png')}
              style={styles.buttonImage}
            />
            <Text>송금하기</Text>
          </View>
          <View style={styles.button}>
            <Image
              source={require('@/assets/Pay/menu/chargePay.png')}
              style={styles.buttonImage}
            />
            <Text>Pay 충전</Text>
          </View>
        </View>
      </View>
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
    </ScrollView>
  );
}

const screenWidth = Dimensions.get('window').width;
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
    marginVertical: 10,
  },
  title: {
    fontWeight: 'bold',
    color: colors.BLACK,
    marginBottom: 10,
  },
  bankImage: {
    resizeMode: 'contain',
    height: 20,
    width: 100,
  },
  accountText: {
    fontSize: 16,
  },
  connectButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: colors.GREEN_300,
    borderWidth: 2,
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
  },
  connectButtonText: {
    color: colors.GREEN_700,
    fontWeight: 'bold',
  },
  balance: {
    fontSize: 22,
    textAlign: 'right',
    color: colors.BLACK,
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingVertical: 20,
    justifyContent: 'space-between',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonImage: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    marginHorizontal: 10,
    marginBottom: 10,
  },
  historyContainer: {},
});

export default PayHomeScreen;
