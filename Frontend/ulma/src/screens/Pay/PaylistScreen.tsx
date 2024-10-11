import React, {useEffect, useState} from 'react';
import {
  View,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/Entypo';
import {colors} from '@/constants';
import axiosInstance from '@/api/axios';

interface Transaction {
  date: string;
  guest: string;
  amount: string;
  description: string;
  type: 'SEND' | 'RECEIVE' | 'CHARGE';
}

const PaylistScreen = () => {
  const [searchMode, setSearchMode] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [payHistory, setPayHistory] = useState<Transaction[]>([]);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('ALL');
  const [items, setItems] = useState([
    {label: '전체 보기', value: 'ALL'},
    {label: '출금', value: 'SEND'},
    {label: '입금', value: 'RECEIVE'},
    {label: '충전', value: 'CHARGE'},
  ]);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get('/users/pay', {
        params: {
          ...(value !== 'ALL' && {payType: value}),
        },
      });
      console.log(response.data.data);

      const formattedData: Transaction[] = response.data.data.map(
        (item: any) => ({
          amount: item.amount,
          date: item.transactionDate.slice(0, 10),
          guest: item.counterpartyName,
          description: item.description,
          type: item.transactionType === 'SEND' ? 'SEND' : 'RECEIVE',
        }),
      );

      setPayHistory(formattedData);
    } catch (error) {
      console.error('계좌 이력을 불러오는 중 에러가 발생했습니다:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [value]);

  // 거래 내역
  const renderTransaction = ({item}: {item: Transaction}) => (
    <View style={styles.transactionItem}>
      <View style={styles.iconContainer}>
        <Text style={styles.iconText}>PAY</Text>
      </View>
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionText}>{item.guest}</Text>
        <Text style={styles.dateText}>
          {item.description} | {item.date}
        </Text>
      </View>
      <Text
        style={[
          styles.amountText,
          item.type === 'SEND' ? styles.negative : styles.positive,
        ]}>
        {item.type === 'SEND'
          ? `                                                                                                                                                                                                      ${Number(
              item.amount,
            ).toLocaleString()}`
          : Number(item.amount).toLocaleString()}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.listContainer}>
        {/* 검색창 */}
        <View style={styles.searchContainer}>
          {searchMode ? (
            <TextInput
              style={styles.searchInput}
              placeholder="검색..."
              value={searchText}
              onChangeText={setSearchText}
              onBlur={() => setSearchMode(false)}
            />
          ) : (
            <View style={styles.searchBefore}>
              {/* 드롭다운 메뉴 */}
              <DropDownPicker
                open={open}
                value={value}
                items={items}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setItems}
                containerStyle={{
                  width: '40%',
                }}
                style={{
                  backgroundColor: colors.LIGHTGRAY,
                  borderWidth: 0,
                }}
                dropDownContainerStyle={{
                  backgroundColor: colors.WHITE,
                  borderColor: colors.GRAY_100,
                  shadowColor: colors.BLACK,
                  shadowOffset: {width: 0, height: 2},
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              />
              <TouchableOpacity onPress={() => setSearchMode(true)}>
                <Icon
                  name="magnifying-glass"
                  size={24}
                  color={colors.GRAY_700}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
        {/* 송금 내역 리스트 */}
        <FlatList
          data={payHistory}
          renderItem={renderTransaction}
          style={styles.transactionList}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchContainer: {
    marginVertical: 6,
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    height: 45,
  },
  searchBefore: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  searchInput: {
    padding: 8,
    borderBottomColor: colors.GREEN_700,
    borderBottomWidth: 0.5,
    width: '100%',
  },
  transactionList: {
    paddingHorizontal: 16,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.GRAY_300,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.GREEN_700,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.WHITE,
  },
  transactionDetails: {
    flex: 1,
    paddingHorizontal: 10,
  },
  transactionText: {
    fontSize: 16,
  },
  dateText: {
    fontSize: 12,
    color: colors.GRAY_700,
  },
  amountText: {
    fontSize: 16,
  },
  positive: {
    color: colors.PINK,
    fontWeight: 'bold',
  },
  negative: {
    color: colors.BLACK,
  },
  listContainer: {
    backgroundColor: colors.LIGHTGRAY,
    borderRadius: 8,
    flex: 1,
    overflow: 'scroll',
  },
});

export default PaylistScreen;
