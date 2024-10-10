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
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Toast from 'react-native-toast-message';

interface Transaction {
  id: string;
  name: string;
  amount: string;
  selected: boolean;
  transactionType: string;
}

type AccounthistoryScreenProps = StackScreenProps<
  payStackParamList,
  typeof eventNavigations.ACCOUNT_HISTORY
>;

function AccounthistoryScreen({navigation}: AccounthistoryScreenProps) {
  const [accountHistory, setAccountHistory] = useState<Transaction[]>([]);
  const {accountNumber, bankCode, getAccountInfo} = usePayStore();
  const {setSelectedTransactions, eventID} = useEventStore(); // eventStore에서 메서드와 eventID 가져오기

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
          id: item.id, // transactionDate를 id로 사용
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
      let isMounted = true; // 중복 호출 방지를 위한 플래그

      if (!accountNumber) {
        getAccountInfo();
      } else if (isMounted) {
        setAccountHistory([]); // 상태 초기화
        setHasMore(true);
        fetchAccountHistory(0);
      }

      return () => {
        isMounted = false; // 컴포넌트 언마운트 시 플래그 false 설정
      };
    }, [accountNumber]),
  );

  const toggleSelect = (id: string) => {
    setAccountHistory(prevData =>
      prevData.map(item =>
        item.id === id ? {...item, selected: !item.selected} : item,
      ),
    );
  };

  const formatAmount = (amount: string, transactionType: string) => {
    const formattedAmount = parseFloat(amount).toLocaleString(); // 3자리마다 쉼표 추가
    return transactionType === 'SEND' ? `${formattedAmount}` : formattedAmount;
  };

  const registerParticipants = async (
    participants: Array<{name: string; amount: string}>,
    eventId: number,
  ) => {
    const participantList = []; // 한 번에 전송할 참가자 리스트

    for (const participant of participants) {
      const {name, amount} = participant;
      let guestId = null;

      try {
        // 1. 이름으로 게스트 검색
        const searchResponse = await axiosInstance.get('/participant/same', {
          params: {name: name},
        });

        console.log('검색 결과: ', searchResponse.data);
        console.log(name);

        // 2. 검색 결과에서 게스트 ID를 가져옴
        // 검색 결과가 없으면 (length < 1) 지인 등록 로직으로 넘어감
        if (searchResponse.data.data.length < 1) {
          throw {response: {status: 400}}; // 강제로 400 에러를 던져 지인 등록 로직으로 이동
        }

        guestId = searchResponse.data.data[0].guestId; // 첫 번째 항목의 guestId 가져오기
        console.log(`기존 게스트 ID: ${guestId}`);
      } catch (error) {
        // 3. 400 에러 발생 시 지인 등록 로직 실행
        if (error.response && error.response.status === 400) {
          console.log(`${name}님의 정보가 없어서 새로 등록합니다.`);
          try {
            // 4. 새로운 지인 등록
            const registerResponse = await axiosInstance.post('/participant', [
              {
                name: name,
                category: '기타',
              },
            ]);

            console.log(registerResponse);

            // 5. 등록된 후 다시 지인 검색
            const searchAfterRegisterResponse = await axiosInstance.get(
              '/participant/same',
              {
                params: {name: name},
              },
            );

            // 6. 새로 검색된 지인의 guestId 가져오기
            guestId = searchAfterRegisterResponse.data.data[0].guestId;
            console.log(`새로 등록 후 검색된 게스트 ID: ${guestId}`);
          } catch (registerError) {
            console.error('지인 등록 중 오류 발생: ', registerError);
            throw registerError; // 필요한 경우 오류 던지기
          }
        } else {
          console.error('게스트 검색/등록 실패: ', error);
          throw error; // 다른 에러 처리
        }
      }

      // 7. 리스트에 추가
      participantList.push({
        eventId: eventId,
        guestId: guestId,
        amount: amount,
      });
    }

    // 8. 게스트 ID와 금액을 한 번에 /participant/money로 전송
    try {
      await axiosInstance.post('/participant/money', participantList);
      console.log('참가자들이 성공적으로 등록되었습니다.');
    } catch (error) {
      console.error('참가자 등록 중 오류 발생:', error);
      throw error; // 필요한 경우 오류 처리
    }
  };

  const handleConfirm = async () => {
    const selectedTransactions = accountHistory.filter(item => item.selected);

    if (selectedTransactions.length === 0) {
      Toast.show({
        text1: '선택된 항목이 없습니다.',
        type: 'error',
      });
      return;
    }

    // 1. 선택된 항목들을 participants 배열에 저장
    const participants = selectedTransactions.map(transaction => ({
      name: transaction.name, // 이름 필드 확인
      amount: transaction.amount,
    }));

    try {
      // 2. 참가자 리스트를 등록하는 함수 호출
      await registerParticipants(participants, eventID); // eventID를 인자로 전달

      setSelectedTransactions(selectedTransactions); // 선택된 항목을 eventStore에 저장
      navigation.navigate(eventNavigations.FRIEND_SEARCH); // 다음 페이지로 이동
    } catch (error) {
      Toast.show({
        text1: '참가자 등록 중 오류가 발생했습니다.',
        type: 'error',
      });
    }
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
          {formatAmount(item.amount, item.transactionType)} 원
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
          ListFooterComponent={
            loading ? (
              <ActivityIndicator size="large" color={colors.GREEN_700} />
            ) : null
          } // 로딩 중일 때 ActivityIndicator를 보여줌
          style={styles.list}
        />
      </View>
      <CustomButton label="등록하기" size="full" onPress={handleConfirm} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
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
    marginBottom: 80,
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
