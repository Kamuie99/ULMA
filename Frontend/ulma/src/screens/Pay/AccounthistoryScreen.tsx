//입출금 내역 선택 페이지
import axiosInstance from '@/api/axios';
import CustomButton from '@/components/common/CustomButton';
import {colors} from '@/constants';
import {payNavigations} from '@/constants/navigations';
import {payStackParamList} from '@/navigations/stack/PayStackNavigator';
import useAuthStore from '@/store/useAuthStore';
import usePayStore from '@/store/usePayStore';
import {useFocusEffect} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Button,
} from 'react-native';

interface Transaction {
  id: string;
  name: string;
  amount: string;
  selected: boolean;
}

type AccounthistoryScreenProps = StackScreenProps<
  payStackParamList,
  typeof payNavigations.ACCOUNT_HISTORY
>;

function AccounthistoryScreen({navigation}: AccounthistoryScreenProps) {
  const [accountHistory, setAccountHistory] = useState([]);
  const {accessToken} = useAuthStore();
  const {accountNumber, bankCode} = usePayStore();

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
    }, []),
  );

  const [data, setData] = useState<Transaction[]>();
  useEffect(() => {
    if (accountHistory && accountHistory.length > 0) {
      const formattedData = accountHistory.map((item, index) => ({
        id: item.id || String(index),
        name: item.name,
        amount: `${item.amount} 원`,
        selected: false,
      }));
      setData(formattedData);
    }
  }, [accountHistory]); // accountHistory가 변경될 때마다 실행

  const toggleSelect = (id: string) => {
    setData(prevData =>
      prevData.map(item =>
        item.id === id ? {...item, selected: !item.selected} : item,
      ),
    );
  };

  const renderItem = ({item}: {item: Transaction}) => (
    <TouchableOpacity
      style={[styles.item, item.selected && styles.selectedItem]}
      onPress={() => toggleSelect(item.id)}>
      <Text>
        {item.selected ? (
          <Text style={styles.check}>√</Text>
        ) : (
          <Text style={styles.noCheck}>▢</Text>
        )}
      </Text>
      <View style={styles.textContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.amount}>{item.amount}</Text>
      </View>
    </TouchableOpacity>
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
    shadowOpacity: 0.25, // 그림자의 투명도
    shadowRadius: 20, // 그림자의 흐림 정도
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
    // borderRadius: 10,
    marginVertical: 2,
  },
  selectedItem: {
    backgroundColor: '#FDEDEC', // 선택된 항목 배경색
  },
  name: {
    fontSize: 16,
    width: '50%',
    alignItems: 'flex-start',
  },
  amount: {
    fontSize: 16,
  },
  noCheck: {
    fontSize: 18,
    fontWeight: '800',
  },
  check: {
    fontSize: 18,
    color: colors.PINK,
    fontWeight: '800',
  },
});

export default AccounthistoryScreen;
