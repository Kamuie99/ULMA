//입출금 내역 선택 페이지
import axiosInstance from '@/api/axios';
import CustomButton from '@/components/common/CustomButton';
import {colors} from '@/constants';
import {eventNavigations, payNavigations} from '@/constants/navigations';
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
  const [accountHistory, setAccountHistory] = useState<Transaction[]>([]);
  const {accessToken} = useAuthStore();
  const {accountNumber, bankCode} = usePayStore();

  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0); // 페이지 번호 상태
  const [hasMore, setHasMore] = useState(true); // 더 가져올 데이터가 있는지 확인하는 상태

  // 데이터 가져오기 함수
  const fetchAccountHistory = async (newPage: number) => {
    if (loading || !hasMore) return; // 로딩 중이거나 더 불러올 데이터가 없으면 중단

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

      // 새 데이터가 있으면 추가, 없으면 hasMore false로 설정
      if (newData.length > 0) {
        setAccountHistory(prev => [...prev, ...newData]);
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

  // 페이지 처음 로드 시 첫 페이지 데이터 가져오기
  useFocusEffect(
    useCallback(() => {
      setAccountHistory([]); // 초기화
      setHasMore(true); // 데이터 더 불러올 수 있도록 설정
      fetchAccountHistory(0); // 첫 페이지 데이터 불러오기
    }, [accountNumber]),
  );

  const toggleSelect = (id: string) => {
    setAccountHistory(prevData =>
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

  // 스크롤이 끝에 도달했을 때 다음 페이지 데이터 요청
  const handleEndReached = () => {
    if (!loading && hasMore) {
      fetchAccountHistory(page + 1); // 다음 페이지 불러오기
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
          onEndReached={handleEndReached} // 끝에 도달 시 호출
          onEndReachedThreshold={0.5} // 리스트 끝에서 50% 지점에서 데이터 로드
          ListFooterComponent={loading && <Text>Loading...</Text>} // 로딩 중일 때 표시
          style={styles.list}
        />
      </View>
      <CustomButton
        label="확인"
        variant="outlined"
        onPress={() => navigation.navigate(eventNavigations.FRIEND_SEARCH)}
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
    flexGrow: 1,
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
