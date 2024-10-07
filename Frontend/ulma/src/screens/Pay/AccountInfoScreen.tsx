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
                    ? styles.selectedAccountBox
                    : {},
                ]}>
                <TouchableOpacity
                  style={styles.accountDetails}
                  onPress={() => handleSelectAccount(account)}>
                  <Text>{account.bankCode}</Text>
                  <Text>{account.accountNumber}</Text>
                  <Text>{account.balance} 원</Text>
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
    padding: 10,
    marginBottom: 10,
  },
  selectedAccountBox: {
    backgroundColor: colors.LIGHTPINK,
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
});

export default AccountInfoScreen;
