import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, View, Text, FlatList} from 'react-native';
import axiosInstance from '@/api/axios';
import CustomButton from '@/components/common/CustomButton';
import {colors} from '@/constants';
import useAuthStore from '@/store/useAuthStore';
import {useFocusEffect, useRoute} from '@react-navigation/native';
import Toast from 'react-native-toast-message';

interface Transaction {
  id: string;
  name: string;
  amount: string;
}

const AccountDetailScreen: React.FC = () => {
  const route = useRoute();
  const params = route.params as {accountNumber: string; bankCode: string};

  const [accountHistory, setAccountHistory] = useState([]);
  const {accessToken} = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useFocusEffect(
    useCallback(() => {
      const fetchAccountHistory = async () => {
        setLoading(true);
        try {
          const response = await axiosInstance.get(
            `/account/${params.accountNumber}/history`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            },
          );
          setAccountHistory(response.data.data);
          console.log(response.data.data);
        } catch (err) {
          console.log(err);
          if (err.code === 401) {
            Toast.show({
              type: 'error',
              text1: '로그인이 만료되었습니다.',
            });
            navigation.navigate('Auth', {screen: 'LoginScreen'});
          }
          Toast.show({
            type: 'error',
            text1: '거래 내역을 가져오는 중 에러가 발생했습니다.',
          });
          setError(err);
        } finally {
          setLoading(false);
        }
      };
      fetchAccountHistory();
    }, [accessToken, params.accountNumber]),
  );

  const [data, setData] = useState<Transaction[]>();
  useEffect(() => {
    if (accountHistory && accountHistory.length > 0) {
      const formattedData = accountHistory.map((item, index) => ({
        id: item.id || String(index),
        description: item.description,
        name: item.counterpartyName,
        amount:
          item.transactionType === 'SEND'
            ? `- ${item.amount} 원`
            : `${item.amount} 원`,
      }));
      setData(formattedData);
    }
  }, [accountHistory]);

  const renderItem = ({item}: {item: Transaction}) => (
    <View style={styles.item}>
      <View style={styles.textContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.amount}>{item.amount}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.cardContiner}>
        <View style={styles.accountInfoContainer}>
          <Text style={styles.accountInfo}>{params.bankCode}</Text>
          <Text style={styles.accountInfo}>{params.accountNumber}</Text>
        </View>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          style={styles.list}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.LIGHTGRAY,
  },
  accountInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 25,
    marginBottom: 10,
  },
  accountInfo: {
    color: colors.GRAY_700,
    fontSize: 16,
  },
  cardContiner: {
    flex: 1,
    backgroundColor: colors.WHITE,
    margin: 20,
    paddingTop: 20,
    borderRadius: 15,
    borderColor: colors.GRAY_300,
    borderWidth: 1,
    shadowColor: colors.BLACK,
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 4,
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
  },
  list: {
    flexGrow: 0,
    paddingHorizontal: 20,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    paddingVertical: 10,
    marginVertical: 2,
  },
  name: {
    fontSize: 16,
    width: '50%',
    alignItems: 'flex-start',
  },
  amount: {
    fontSize: 16,
  },
});

export default AccountDetailScreen;
