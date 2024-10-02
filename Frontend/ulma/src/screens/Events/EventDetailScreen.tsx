import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome'; // FontAwesome 아이콘 사용
import axiosInstance from '@/api/axios';
import {eventStackParamList} from '@/navigations/stack/EventStackNavigator';

// RouteProp 타입 정의
type EventDetailScreenRouteProp = RouteProp<
  eventStackParamList,
  'EVENT_DETAIL'
>;

interface EventDetailScreenProps {
  route: EventDetailScreenRouteProp;
  customProp?: string; // 전달된 customProp
}

interface Guest {
  guestId: number;
  guestName: string;
  category: string;
  amount: number;
}

const EventDetailScreen: React.FC<EventDetailScreenProps> = ({
  route,
  customProp,
}) => {
  const {event_id} = route.params; // event_id 가져오기
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState(false); // 모달 가시성 상태
  const [guestId, setGuestId] = useState(''); // 입력된 guestId
  const [amount, setAmount] = useState(''); // 입력된 amount
  const [page, setPage] = useState(1); // 페이지 상태
  const [isFetchingMore, setIsFetchingMore] = useState(false); // 추가 데이터 불러오는 중인지 상태
  const [hasMoreData, setHasMoreData] = useState(true); // 더 가져올 데이터가 있는지
  const [searchQuery, setSearchQuery] = useState(''); // 검색어 상태
  const [searchResults, setSearchResults] = useState<Guest[]>([]);
  const [selectedGuest, setSelectedGuest] = useState<string | null>(null); // 선택한 사용자
  const [searchExpanded, setSearchExpanded] = useState(false);

  // 이벤트 상세 내역 불러오기
  const fetchEventDetail = async (newPage = 1) => {
    if (!hasMoreData || isFetchingMore) return;

    try {
      setIsFetchingMore(true);
      const response = await axiosInstance.get(
        `/events/detail/${event_id}?page=${newPage}`,
      );
      const newGuests = response.data.data;

      // 페이지의 데이터를 추가
      setGuests(prevGuests => [...prevGuests, ...newGuests]);

      // 더 가져올 데이터가 있는지 확인
      if (newGuests.length === 0 || response.data.totalPages <= newPage) {
        setHasMoreData(false); // 더 이상 데이터 없음
      }

      setLoading(false);
      setIsFetchingMore(false);
    } catch (error) {
      console.error('이벤트 상세 내역을 불러오는 중 오류 발생:', error);
      Alert.alert(
        '에러',
        '이벤트 상세 내역을 불러오는 중 오류가 발생했습니다.',
      );
      setLoading(false);
      setIsFetchingMore(false);
    }
  };

  // 초기 데이터를 불러오기 위한 useEffect
  useEffect(() => {
    fetchEventDetail(); // 첫 번째 페이지 데이터를 불러옴
  }, [event_id]);

  // 추가 데이터를 불러오는 함수
  const loadMoreData = () => {
    if (!isFetchingMore && hasMoreData) {
      fetchEventDetail(page + 1); // 다음 페이지 불러오기
      setPage(prevPage => prevPage + 1); // 페이지 증가
    }
  };

  // API 호출 함수: 사용자 검색
  const searchUser = async () => {
    if (searchQuery.trim() === '') return; // 빈 검색어 방지

    try {
      const response = await axiosInstance.get(`/api/participant/same`, {
        params: {name: searchQuery},
      });
      setSearchResults(response.data.data); // 검색 결과 반영
    } catch (error) {
      console.error('사용자 검색 중 오류 발생:', error);
      Alert.alert('에러', '사용자를 검색하는 중 오류가 발생했습니다.');
    }
  };

  // POST 요청을 통해 새로운 거래내역 추가
  const addTransaction = async () => {
    try {
      const response = await axiosInstance.post('/participant/money', {
        eventId: event_id,
        guestId: selectedGuest, // 선택된 사용자
        amount,
      });
      Alert.alert('성공', '거래내역이 추가되었습니다.');
      setModalVisible(false); // 모달 닫기
      fetchEventDetail(); // 새로고침
    } catch (error: any) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        const errorMessage = error.response.data.message;

        if (
          errorMessage.includes('duplicate') ||
          errorMessage.includes('already exists')
        ) {
          Alert.alert('에러', '이미 등록된 지인입니다.');
        } else {
          Alert.alert('에러', '거래내역을 추가하는 중 오류가 발생했습니다.');
        }
      } else {
        Alert.alert('에러', '알 수 없는 오류가 발생했습니다.');
      }
    }
  };

  const handleSelectGuest = (guestName: string) => {
    setSelectedGuest(guestName); // 선택한 사용자의 이름 설정
    setSearchQuery(guestName); // 검색 창에 이름 반영
    setSearchResults([]); // 검색 결과 초기화
  };

  const handleClearSearch = () => {
    setSelectedGuest(null); // 선택된 사용자 초기화
    setSearchQuery(''); // 검색어 초기화
  };

  // 검색어에 따라 필터링된 손님 목록을 반환
  const filteredGuests = guests.filter(guest =>
    guest.guestName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (loading && guests.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00C77F" />
      </View>
    );
  }

  if (!guests || guests.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text>{event_id}</Text>
        <Text>이벤트 내역을 불러올 수 없습니다.</Text>
      </View>
    );
  }

  // 각 손님 내역을 렌더링하는 함수
  const renderItem = ({item}: {item: Guest}) => (
    <View style={styles.guestBox}>
      <Text style={styles.guestName}>{item.guestName}</Text>
      <Text style={styles.guestCategory}>나와의 관계: {item.category}</Text>
      <Text style={styles.guestAmount}>
        금액: {item.amount.toLocaleString()}원
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text>{event_id}</Text>
        <Text style={styles.title}>이벤트 상세 내역</Text>

        {/* 검색창 */}
        <View
          style={
            searchExpanded
              ? styles.searchBoxExpanded
              : styles.searchBoxCollapsed
          }>
          {searchExpanded && (
            <TextInput
              style={styles.searchInput}
              placeholder="이름으로 검색"
              value={searchQuery}
              onChangeText={setSearchQuery} // 검색어 업데이트
              onSubmitEditing={searchUser} // 입력 완료 시 검색 호출
            />
          )}
        </View>

        {/* 검색창 확장 버튼 */}
        {!searchExpanded && (
          <TouchableOpacity
            onPress={() => setSearchExpanded(true)}
            style={styles.searchButton}>
            <Icon name="search" size={20} color="#000" />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filteredGuests} // 필터링된 목록 사용
        keyExtractor={item => item.guestId.toString()}
        renderItem={renderItem}
        onEndReached={loadMoreData} // 스크롤 끝에 도달하면 더 많은 데이터 불러오기
        onEndReachedThreshold={0.5} // 50% 스크롤 시점에서 더 불러옴
        ListFooterComponent={
          isFetchingMore ? (
            <ActivityIndicator size="small" color="#00C77F" />
          ) : null
        }
      />

      {/* 거래내역 추가 버튼 */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>거래내역 직접 등록하기</Text>
      </TouchableOpacity>

      {/* 모달 창 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* 사용자 검색 */}
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.input}
                placeholder="사용자 검색"
                value={searchQuery}
                onChangeText={text => {
                  setSearchQuery(text);
                  searchUser(); // 검색 호출
                }}
              />
              {selectedGuest ? (
                <TouchableOpacity
                  onPress={handleClearSearch}
                  style={styles.clearButton}>
                  <Icon name="times" size={20} color="#000" />
                </TouchableOpacity>
              ) : null}
            </View>

            {/* 검색 결과 표시 */}
            {searchResults.length > 0 && (
              <FlatList
                data={searchResults}
                keyExtractor={item => item.guestId.toString()}
                renderItem={({item}) => (
                  <TouchableOpacity
                    style={styles.searchResultItem}
                    onPress={() => handleSelectGuest(item.guestName)}>
                    <Text>{item.guestName}</Text>
                  </TouchableOpacity>
                )}
              />
            )}

            <TextInput
              style={styles.input}
              placeholder="금액"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
            />

            <TouchableOpacity
              style={styles.submitButton}
              onPress={addTransaction}>
              <Text style={styles.submitButtonText}>등록하기</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelButtonText}>취소</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // 타이틀과 검색창을 양끝에 배치
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  searchBoxCollapsed: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 40,
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
  },
  searchBoxExpanded: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 10,
    width: '50%', // 확장 시 너비를 넓게 설정
  },
  searchInput: {
    flex: 1,
    padding: 8,
  },
  searchButton: {
    marginLeft: 16,
  },
  guestBox: {
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 10,
  },
  guestName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  guestCategory: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
  },
  guestAmount: {
    fontSize: 14,
    color: '#333',
  },
  addButton: {
    backgroundColor: '#00C77F',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  input: {
    width: '100%',
    padding: 10,
    borderBottomWidth: 1,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#00C77F',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#888',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clearButton: {
    marginLeft: 10,
  },
  searchResultItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
});

export default EventDetailScreen;
