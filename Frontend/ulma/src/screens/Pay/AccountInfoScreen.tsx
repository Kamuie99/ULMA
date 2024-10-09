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
import {payNavigations} from '@/constants/navigations'; // payNavigations import 추가
import {payStackParamList} from '@/navigations/stack/PayStackNavigator';
import {bankColors} from '@/constants/bankColors';

function AccountInfoScreen() {
  const navigation = useNavigation();
  const {accountNumber} = usePayStore(); // Zustand에서 accountNumber 가져오기
  const {accessToken} = useAuthStore();
  const [accountInfo, setAccountInfo] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);

  // 계좌 정보 가져오기
  useEffect(() => {
    if (!accessToken) return;

    const fetchAccountInfo = async () => {
      try {
        const response = await axiosInstance.get('/users/account', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
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

    fetchAccountInfo();
  }, [accessToken, accountNumber]); // accountNumber가 바뀌면 다시 실행

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

  // 배경 opacity
  const hexToRgba = (hex, opacity) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

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
                        // backgroundColor: hexToRgba(
                        //   bankColors[account.bankCode],
                        //   1,
                        // ),
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
              size="maxSize"
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
    // textAlign: 'right',
  },
});

export default AccountInfoScreen;
