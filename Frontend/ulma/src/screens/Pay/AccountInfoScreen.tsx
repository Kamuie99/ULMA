import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import axiosInstance from '@/api/axios';
import CustomButton from '@/components/common/CustomButton';
import {colors} from '@/constants';
import Icon from 'react-native-vector-icons/Entypo';
import useAuthStore from '@/store/useAuthStore';
import {useNavigation} from '@react-navigation/native';
import {ScrollView} from 'react-native-gesture-handler';
import usePayStore from '@/store/usePayStore';
import Toast from 'react-native-toast-message';
import {payNavigations} from '@/constants/navigations';
import {payStackParamList} from '@/navigations/stack/PayStackNavigator';
import {bankColors} from '@/constants/bankColors';
import TouchID from 'react-native-touch-id'; // Touch ID 라이브러리 추가

function AccountInfoScreen() {
  const navigation = useNavigation();
  const {accountNumber} = usePayStore(); // Zustand에서 accountNumber 가져오기
  const {accessToken} = useAuthStore();
  const [accountInfo, setAccountInfo] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // 지문 인증 상태

  // Touch ID 설정
  const optionalConfigObject = {
    title: '인증 필요', // 다이얼로그 제목
    color: colors.BLACK, // Android에서 지문 아이콘 색상
    fallbackLabel: '비밀번호 입력', // 인증 실패 시 대체 텍스트
  };

  // 지문 인증 로직
  useEffect(() => {
    TouchID.authenticate(
      '계좌 정보를 확인하기 위해 인증이 필요합니다.',
      optionalConfigObject,
    )
      .then(success => {
        setIsAuthenticated(true); // 인증 성공 시
        navigation.navigate(payNavigations.ACCOUNT_INFO);
      })
      .catch(error => {
        console.log('지문 인증 실패:', error);
        Toast.show({
          text1: '지문 인증에 실패했습니다.',
          type: 'error',
        });
        navigation.navigate(payNavigations.TFA);
      });
  }, []);

  useEffect(() => {
    const fetchAccountInfo = async () => {
      try {
        const response = await axiosInstance.get('/users/account');
        setAccountInfo(response.data);

        // Zustand에서 가져온 accountNumber와 일치하는 계좌를 selectedAccount로 설정
        const matchedAccount = response.data.find(
          account => account.accountNumber === accountNumber,
        );

        if (matchedAccount) {
          setSelectedAccount(matchedAccount);
        }
      } catch (error) {
        console.error('계정 정보를 불러오는 중 에러가 발생했습니다:', error);
      }
    };

    if (isAuthenticated) {
      fetchAccountInfo(); // 인증 후 계좌 정보 불러오기
    }
  }, [accessToken, accountNumber, isAuthenticated]); // accountNumber가 바뀌면 다시 실행

  const handleSelectAccount = account => {
    setSelectedAccount({
      accountNumber: account.accountNumber,
      bankCode: account.bankCode,
    });
  };

  const handleViewAccountDetail = account => {
    navigation.navigate<payStackParamList>(payNavigations.ACCOUNT_DETAIL, {
      accountNumber: account.accountNumber,
      bankCode: account.bankCode,
    });
  };

  const handleAccountAction = async () => {
    if (!selectedAccount) return;
    try {
      const response = await axiosInstance.post('/users/account', {
        bankCode: selectedAccount.bankCode,
        accountNumber: selectedAccount.accountNumber,
      });
      console.log('post요청:', response.data);
      Toast.show({
        text1: '연결 계좌가 변경되었습니다.',
        type: 'success',
      });
    } catch (error) {
      console.error('작업 수행 중 에러가 발생했습니다:', error);
    }
  };

  if (!isAuthenticated) {
    return <View style={styles.container}></View>; // 인증 중일 때 표시할 화면
  }

  return (
    <View style={styles.container}>
      {accountInfo.length > 0 ? (
        <>
          <ScrollView>
            {accountInfo.map(account => (
              <View
                key={account.id}
                style={[
                  styles.accountItemContainer,
                  selectedAccount?.accountNumber === account.accountNumber
                    ? {
                        backgroundColor: colors.YELLOW,
                      }
                    : {},
                ]}>
                <TouchableOpacity
                  style={styles.accountDetails}
                  onPress={() => handleSelectAccount(account)}>
                  <Text style={styles.bankCode}>{account.bankCode}</Text>

                  <Text style={styles.accountNumber}>
                    {account.accountNumber}
                  </Text>
                  <Text style={styles.balance}>
                    {account.balance.toLocaleString()} 원
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.viewButton}
                  onPress={() => handleViewAccountDetail(account)}>
                  <Icon
                    name="chevron-right"
                    size={24}
                    color={colors.GRAY_700}
                  />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
          {selectedAccount && (
            <CustomButton
              label="해당 계좌 Pay 연결하기"
              size="full"
              onPress={handleAccountAction}
            />
          )}
        </>
      ) : (
        <Text style={styles.noAccountsText}>계좌 정보가 없습니다 😥</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
    padding: 15,
    gap: 10,
  },
  accountItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.WHITE,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.GRAY_300,
    padding: 15,
    marginBottom: 10,
  },
  selectedAccount: {
    color: colors.BLACK,
  },
  accountDetails: {
    flex: 1,
  },
  viewButton: {
    borderRadius: 5,
    padding: 10,
  },
  viewButtonText: {
    color: colors.WHITE,
    fontWeight: 'bold',
  },
  noAccountsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
  },
  bankCode: {
    fontWeight: 'bold',
    fontSize: 16,
    color: colors.BLACK,
  },
  accountNumber: {
    marginTop: 5,
    marginBottom: 8,
  },
  balance: {
    fontSize: 16,
  },
});

export default AccountInfoScreen;
