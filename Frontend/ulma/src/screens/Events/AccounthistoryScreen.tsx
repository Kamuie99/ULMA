import axiosInstance from '@/api/axios';
import CustomButton from '@/components/common/CustomButton';
import {colors} from '@/constants';
import {eventNavigations, payNavigations} from '@/constants/navigations';
import {payStackParamList} from '@/navigations/stack/PayStackNavigator';
import useAuthStore from '@/store/useAuthStore';
import usePayStore from '@/store/usePayStore';
import useEventStore from '@/store/useEventStore'; // eventStore 추가
import {useFocusEffect} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import React, {useCallback, useState} from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';

interface Transaction {
  id: string;
  name: string;
  amount: string;
  selected: boolean;
  transactionType: string;
}

type AccounthistoryScreenProps = StackScreenProps<
  payStackParamList,
  typeof payNavigations.ACCOUNT_HISTORY
>;

function AccounthistoryScreen({navigation}: AccounthistoryScreenProps) {
  const [accountHistory, setAccountHistory] = useState<Transaction[]>([]);
  const {accountNumber, bankCode} = usePayStore();
  const {setSelectedTransactions} = useEventStore(); // eventStore에서 메서드 가져오기

  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // 데이터 가져오기 함수
  const fetchAccountHistory = async (newPage: number) => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/account/${accountNumber}/history`,
        {
          params: {
            page: newPage,
            size: 20,
          },
        },
      );
      const newData = response.data.data;

      if (newData.length > 0) {
        const mappedData = newData.map(item => ({
          id: item.transactionDate, // transactionDate를 id로 사용
          name: item.counterpartyName,
          amount: item.amount,
          selected: false,
          transactionType: item.transactionType, // transactionType 추가
        }));

        setAccountHistory(prev => [...prev, ...mappedData]);
        setPage(newPage);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setAccountHistory([]);
      setHasMore(true);
      fetchAccountHistory(0);
    }, [accountNumber]),
  );

  const toggleSelect = (id: string) => {
    setAccountHistory(prevData =>
      prevData.map(
        item => (item.id === id ? {...item, selected: !item.selected} : item), // 선택된 항목만 상태 변경
      ),
    );
  };

  // 금액 포맷 함수: 3자리마다 쉼표 추가 및 send일 경우 '-' 부호 붙이기
  const formatAmount = (amount: string, transactionType: string) => {
    const formattedAmount = parseFloat(amount).toLocaleString(); // 3자리마다 쉼표 추가
    return transactionType === 'send' ? `-${formattedAmount}` : formattedAmount;
  };

  // 선택된 항목을 eventStore에 저장하는 함수
  const handleConfirm = () => {
    const selectedTransactions = accountHistory.filter(item => item.selected); // 선택된 항목만 필터링
    setSelectedTransactions(selectedTransactions); // 선택된 항목을 eventStore에 저장
    navigation.navigate(eventNavigations.FRIEND_SEARCH); // 다음 페이지로 이동
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
        <Text style={styles.amount}>
          {formatAmount(item.amount, item.transactionType)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const handleEndReached = () => {
    if (!loading && hasMore) {
      fetchAccountHistory(page + 1);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.cardContiner}>
        <View style={styles.accountInfoContainer}>
          <Text style={styles.accountInfo}>{bankCode}</Text>
          <Text style={styles.accountInfo}>{accountNumber}</Text>
        </View>
        <FlatList
          data={accountHistory}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          initialNumToRender={20} // FlatList 성능 최적화
          getItemLayout={(data, index) => ({
            length: 60, // 아이템 높이
            offset: 60 * index,
            index,
          })}
          ListFooterComponent={loading && <Text>Loading...</Text>}
          style={styles.list}
        />
      </View>
      <CustomButton
        label="확인"
        variant="outlined"
        onPress={handleConfirm} // 선택된 항목을 eventStore에 저장하고 페이지 이동
        disabled={!accountHistory.some(item => item.selected)} // 선택된 항목이 없으면 버튼 비활성화
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.LIGHTGRAY,
    padding: 15,
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
    backgroundColor: colors.WHITE,
    paddingVertical: 20,
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
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    marginVertical: 2,
  },
  selectedItem: {
    backgroundColor: '#FDEDEC',
  },
  name: {
    fontSize: 16,
    width: '50%',
    textAlign: 'left',
  },
  amount: {
    fontSize: 16,
    textAlign: 'right', // 금액 오른쪽 정렬
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
