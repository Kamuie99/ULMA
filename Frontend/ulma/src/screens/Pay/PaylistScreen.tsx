//페이 이력보기 페이지

import {colors} from '@/constants';
import Icon from 'react-native-vector-icons/Entypo';

import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';

interface Transaction {
  id: string;
  date: string;
  from: string;
  to: string;
  amount: string;
  type: 'send' | 'receive';
}

const PaylistScreen = () => {
  const [searchMode, setSearchMode] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [transactions] = useState<Transaction[]>([
    {
      id: '1',
      date: '08.27',
      from: 'ULMA페이머니',
      to: '홍길동',
      amount: '- 200,000',
      type: 'send',
    },
    {
      id: '2',
      date: '08.20',
      from: '김사비',
      to: 'ULMA페이머니',
      amount: '400,000',
      type: 'receive',
    },
    {
      id: '3',
      date: '08.20',
      from: '홍길동',
      to: 'ULMA페이머니',
      amount: '500,000',
      type: 'receive',
    },
    {
      id: '4',
      date: '08.20',
      from: '가나다',
      to: 'ULMA페이머니',
      amount: '600,000',
      type: 'receive',
    },
    {
      id: '5',
      date: '08.15',
      from: 'ULMA페이머니',
      to: '윤예리',
      amount: '- 100,000',
      type: 'send',
    },
  ]);

  const renderTransaction = ({item}: {item: Transaction}) => (
    <View style={styles.transactionItem}>
      <View style={styles.iconContainer}>
        <Text style={styles.iconText}>PAY</Text>
      </View>
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionText}>
          {item.from} → {item.to}
        </Text>
        <Text style={styles.dateText}>{item.date}</Text>
      </View>
      <Text
        style={[
          styles.amountText,
          item.type === 'send' ? styles.negative : styles.positive,
        ]}>
        {item.amount}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* 상단 Pay 머니 영역 */}
      <View style={styles.moneyContainer}>
        <TouchableOpacity style={styles.moneyWrap}>
          <View>
            <Text style={styles.moneyText}>페이머니</Text>
            <Text style={styles.amountTextLarge}>54,000원</Text>
          </View>
          <Icon name="chevron-right" size={24} color={colors.BLACK} />
        </TouchableOpacity>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.buttonText}>송금</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.buttonText}>충전</Text>
          </TouchableOpacity>
        </View>
      </View>

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
              <Text>머니 송금 내역</Text>
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
          data={transactions}
          renderItem={renderTransaction}
          keyExtractor={item => item.id}
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
  moneyContainer: {
    padding: 20,
    borderColor: colors.GRAY_300,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: colors.WHITE,
    // 그림자
    shadowColor: colors.BLACK,
    shadowOpacity: 0.15, // 그림자의 투명도
    shadowRadius: 20, // 그림자의 흐림 정도
    elevation: 4,
  },
  moneyWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  moneyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.BLACK,
  },
  amountTextLarge: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: colors.BLACK,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: colors.LIGHTGRAY,
    paddingVertical: 9,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: '45%',
    alignItems: 'center',
  },
  buttonText: {
    color: colors.BLACK,
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
  searchIcon: {
    fontSize: 24,
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
    marginTop: 20,
    overflow: 'scroll',
  },
});

export default PaylistScreen;
