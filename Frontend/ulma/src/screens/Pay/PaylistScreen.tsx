//페이 이력보기 페이지

import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import BottomBar from '../../components/common/BottomBar'; // 하단 바 컴포넌트 import

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
      amount: '-200,000원',
      type: 'send',
    },
    {
      id: '2',
      date: '08.20',
      from: '김사비',
      to: 'ULMA페이머니',
      amount: '+400,000원',
      type: 'receive',
    },
    {
      id: '3',
      date: '08.20',
      from: '홍길동',
      to: 'ULMA페이머니',
      amount: '+500,000원',
      type: 'receive',
    },
    {
      id: '4',
      date: '08.20',
      from: '가나다',
      to: 'ULMA페이머니',
      amount: '+600,000원',
      type: 'receive',
    },
    {
      id: '5',
      date: '08.15',
      from: 'ULMA페이머니',
      to: '윤예리',
      amount: '-100,000원',
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
        <Text style={styles.moneyText}>페이머니</Text>
        <Text style={styles.amountTextLarge}>54,000원</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.buttonText}>송금</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.buttonText}>충전</Text>
          </TouchableOpacity>
        </View>
      </View>

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
          <TouchableOpacity onPress={() => setSearchMode(true)}>
            <Text style={styles.searchIcon}>🔍</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 송금 내역 리스트 */}
      <FlatList
        data={transactions}
        renderItem={renderTransaction}
        keyExtractor={item => item.id}
        style={styles.transactionList}
      />

      {/* 하단 바 */}
      <BottomBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  moneyContainer: {
    padding: 20,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    margin: 16,
  },
  moneyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  amountTextLarge: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: '#00C77F',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#00C77F',
    borderRadius: 5,
    padding: 8,
    width: '80%',
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
    borderBottomColor: '#E0E0E0',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 14,
    color: '#00C77F',
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
    color: '#BDBDBD',
  },
  amountText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  positive: {
    color: '#00C77F',
  },
  negative: {
    color: '#FF3B30',
  },
});

export default PaylistScreen;
