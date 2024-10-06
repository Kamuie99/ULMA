import axiosInstance from '@/api/axios';
import CustomButton from '@/components/common/CustomButton';
import {colors} from '@/constants';
import {payNavigations} from '@/constants/navigations';
import {payStackParamList} from '@/navigations/stack/PayStackNavigator';
import useAuthStore from '@/store/useAuthStore';
import {useFocusEffect} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';

interface Transaction {
  id: string;
  name: string;
  amount: string;
}

type AccountDetailScreenProps = StackScreenProps<
  payStackParamList,
  typeof payNavigations.ACCOUNT_DETAIL
> & {
  accountNumber: string;
  bankCode: string;
};

function AccountDetailScreen({
  navigation,
  accountNumber,
  bankCode,
}: AccountDetailScreenProps) {
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
            `/account/${accountNumber}/history`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            },
          );
          setAccountHistory(response.data);
          console.log(accountHistory);
        } catch (err) {
          setError(err);
        } finally {
          setLoading(false);
        }
      };
      fetchAccountHistory();
    }, [accountNumber, accessToken]),
  );

  const [data, setData] = useState<Transaction[]>();
  useEffect(() => {
    if (accountHistory && accountHistory.length > 0) {
      const formattedData = accountHistory.map((item, index) => ({
        id: item.id || String(index),
        name: item.name,
        amount: `${item.amount} 원`,
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
          <Text style={styles.accountInfo}>{bankCode}</Text>
          <Text style={styles.accountInfo}>{accountNumber}</Text>
        </View>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          style={styles.list}
        />
        <CustomButton
          label="확인"
          variant="outlined"
          onPress={() => navigation.navigate(payNavigations.FRIEND_SEARCH)}
        />
      </View>
    </View>
  );
}

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
