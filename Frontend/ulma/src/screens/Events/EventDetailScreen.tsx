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
import {RouteProp, NavigationProp} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axiosInstance from '@/api/axios';
import {eventStackParamList} from '@/navigations/stack/EventStackNavigator';
import InputOptionModal from '@/screens/Events/InputOptionModal'; // 모달 컴포넌트 import
import {colors} from '@/constants';

type EventDetailScreenRouteProp = RouteProp<
  eventStackParamList,
  'EVENT_DETAIL'
>;

interface EventDetailScreenProps {
  route: EventDetailScreenRouteProp;
  navigation: NavigationProp<any>; // 추가
}

interface Guest {
  guestId: number;
  guestName: string;
  category: string;
  amount: number;
}

const EventDetailScreen: React.FC<EventDetailScreenProps> = ({
  route,
  navigation, // 추가
}) => {
  const {event_id} = route.params;
  const [guests, setGuests] = useState<Guest[]>([]);
  const [filteredGuests, setFilteredGuests] = useState<Guest[]>([]); // 검색 결과 상태
  const [loading, setLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [amount, setAmount] = useState('');
  const [page, setPage] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalSearchQuery, setModalSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Guest[]>([]);
  const [selectedGuest, setSelectedGuest] = useState<number | null>(null);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [expandedGuests, setExpandedGuests] = useState<number | null>(null);
  const [inputOptionModalVisible, setInputOptionModalVisible] = useState(false); // 새로운 모달 상태 추가

  // 이벤트 상세 내역 불러오기
  const fetchEventDetail = async (newPage = 1) => {
    if (!hasMoreData || isFetchingMore) return;

    try {
      setIsFetchingMore(true);
      const response = await axiosInstance.get(
        `/events/detail/${event_id}?page=${newPage}`,
      );
      const newGuests = response.data.data;

      setGuests(prevGuests => [...prevGuests, ...newGuests]);
      setFilteredGuests(prevGuests => [...prevGuests, ...newGuests]); // 초기 데이터로 설정

      if (newGuests.length === 0 || response.data.totalPages <= newPage) {
        setHasMoreData(false);
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

  useEffect(() => {
    fetchEventDetail();
  }, [event_id]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredGuests(guests); // 검색어가 없으면 전체 리스트 표시
    } else {
      const filtered = guests.filter(guest =>
        guest.guestName.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredGuests(filtered);
    }
  }, [searchQuery, guests]);

  const loadMoreData = () => {
    if (!isFetchingMore && hasMoreData) {
      fetchEventDetail(page + 1);
      setPage(prevPage => prevPage + 1);
    }
  };

  // 모달 창 밖의 검색 기능
  const searchUser = () => {
    if (searchQuery.trim() === '') {
      setFilteredGuests(guests); // 검색어 없을 시 전체 리스트 표시
    } else {
      const filtered = guests.filter(guest =>
        guest.guestName.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredGuests(filtered);
    }
  };

  // API 호출 함수: 모달창에서의 검색 (지인 목록에서 부분 일치 검색)
  const searchModalUser = async () => {
    try {
      const response = await axiosInstance.get(`/participant/same`, {
        params: {name: modalSearchQuery},
      });
      const guestsWithNames = response.data.data.map((guest: any) => ({
        guestId: guest.guestId,
        guestName: guest.name,
        category: guest.category,
      }));

      setSearchResults(guestsWithNames);
    } catch (error) {
      console.error('모달 내 사용자 검색 중 오류 발생:', error);
      Alert.alert('에러', '지인을 검색하는 중 오류가 발생했습니다.');
    }
  };

  useEffect(() => {
    if (modalVisible && modalSearchQuery) {
      searchModalUser();
    }
  }, [modalSearchQuery]);

  const addTransaction = async () => {
    if (!selectedGuest) {
      Alert.alert('에러', '등록할 지인을 선택해주세요.');
      return;
    }

    if (!amount) {
      Alert.alert('에러', '금액을 입력해주세요.');
      return;
    }

    try {
      const response = await axiosInstance.post('/participant/money', [
        {
          eventId: event_id,
          guestId: selectedGuest,
          amount: Number(amount.replace(/,/g, '')), // 금액에서 콤마 제거 후 숫자로 변환
        },
      ]);

      Alert.alert('성공', '거래내역이 추가되었습니다.', [
        {
          text: 'OK',
          onPress: async () => {
            setModalVisible(false); // 모달 닫기
            setSelectedGuest(null); // 선택된 사용자 초기화
            setModalSearchQuery(''); // 모달 검색어 초기화
            setAmount(''); // 금액 초기화
            setPage(1); // 페이지 초기화

            const response = await axiosInstance.get(
              `/events/detail/${event_id}?page=1`,
            );
            setGuests(response.data.data);
            setFilteredGuests(response.data.data); // 필터된 리스트도 업데이트
            setHasMoreData(response.data.totalPages > 1);
          },
        },
      ]);
    } catch (error: any) {
      // 오류 내용 자세히 출력
      console.error('오류 발생:', error);

      if (error.response) {
        console.error('응답 데이터:', error.response.data);
        console.error('응답 상태:', error.response.status);
        console.error('응답 헤더:', error.response.headers);
        Alert.alert(
          '에러',
          `오류: ${
            error.response.data.message || '알 수 없는 오류가 발생했습니다.'
          }`,
        );
      } else if (error.request) {
        console.error(
          '요청이 전송되었으나 응답을 받지 못했습니다:',
          error.request,
        );
        Alert.alert('에러', '서버로부터 응답을 받지 못했습니다.');
      } else {
        console.error('요청 설정 중에 오류가 발생했습니다:', error.message);
        Alert.alert('에러', '요청을 처리하는 중에 오류가 발생했습니다.');
      }
    }
  };

  const handleSelectGuest = (
    guestId: number,
    guestName: string,
    category: string,
  ) => {
    setSelectedGuest(guestId); // 선택된 지인 ID 저장
    setModalSearchQuery(`${guestName} (${category})`); // 검색창에 선택된 지인의 정보 입력
    setSearchResults([]); // 검색 결과 초기화
    setExpandedGuests(null); // 검색 결과 목록 닫기
  };

  const handleOpenModal = () => {
    setModalVisible(true);
    setModalSearchQuery(''); // 모달 열릴 때마다 검색어 초기화
    setAmount('');
    setSearchResults([]); // 모달이 열릴 때 검색 결과 초기화
  };

  const toggleGuestList = (guestId: number) => {
    if (expandedGuests === guestId) {
      setExpandedGuests(null);
    } else {
      setExpandedGuests(guestId);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* <Text>{event_id}</Text>
        <Text style={styles.title}>이벤트 상세 내역</Text> */}

        <View
          style={
            searchExpanded
              ? styles.searchBoxExpanded``
              : styles.searchBoxCollapsed
          }>
          {searchExpanded && (
            <TextInput
              style={styles.searchInput}
              placeholder="이름으로 검색"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={searchUser}
            />
          )}
        </View>

        {!searchExpanded && (
          <TouchableOpacity
            onPress={() => setSearchExpanded(true)}
            style={styles.searchButton}>
            <Icon name="search" size={20} color="#000" />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filteredGuests}
        keyExtractor={item => item.guestId.toString()}
        renderItem={({item}) => (
          <View style={styles.guestBox}>
            <Text style={styles.guestName}>{item.guestName}</Text>
            <Text style={styles.guestCategory}>
              나와의 관계: {item.category}
            </Text>
            <Text style={styles.guestAmount}>
              금액: {item.amount.toLocaleString()}원
            </Text>
          </View>
        )}
        onEndReached={loadMoreData}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetchingMore ? (
            <ActivityIndicator size="small" color={colors.GREEN_700} />
          ) : null
        }
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>입금 내역이 없습니다.</Text>
            </View>
          ) : null
        }
      />

      {/* 거래내역 직접 등록하기 버튼 */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setInputOptionModalVisible(true)} // 모달창 열기
      >
        <Text style={styles.addButtonText}>편리하게 등록해보세요</Text>
      </TouchableOpacity>

      {/* InputOptionModal 모달 컴포넌트 */}
      <InputOptionModal
        isVisible={inputOptionModalVisible}
        onClose={() => setInputOptionModalVisible(false)}
        onDirectRegister={() => setModalVisible(true)} // 직접 등록하기 클릭 시 기존 모달 열기
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.input}
              placeholder="지인검색(중복검색)"
              value={modalSearchQuery}
              onChangeText={text => setModalSearchQuery(text)}
            />

            {searchResults.length > 0 ? (
              <FlatList
                data={searchResults}
                keyExtractor={item => item.guestId.toString()}
                renderItem={({item}) => (
                  <TouchableOpacity
                    style={styles.searchResultItem}
                    onPress={() =>
                      handleSelectGuest(
                        item.guestId,
                        item.guestName,
                        item.category,
                      )
                    }>
                    <Text>{`${item.guestName} (${item.category})`}</Text>
                  </TouchableOpacity>
                )}
              />
            ) : modalSearchQuery.trim() !== '' && !selectedGuest ? (
              // 검색 결과가 없고 지인이 선택되지 않았을 때만 지인 등록 버튼 표시
              <View style={styles.noResultsContainer}>
                <Text>검색 결과가 없습니다.</Text>
                <TouchableOpacity
                  style={styles.registerButton}
                  onPress={() => {
                    setModalVisible(false); // 모달 닫기
                    navigation.navigate('FriendsStackNavigator', {
                      screen: 'FriendsAddScreen', // 지인 등록 페이지로 이동
                    });
                  }}>
                  <Text style={styles.registerButtonText}>지인 등록하기</Text>
                </TouchableOpacity>
              </View>
            ) : null}

            <TextInput
              style={styles.input}
              placeholder="금액"
              value={amount.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} // 세 자리마다 콤마 추가
              onChangeText={text => {
                const rawValue = text.replace(/,/g, ''); // 입력 시 콤마를 제거한 순수 숫자 값
                const formattedValue = rawValue.replace(
                  /\B(?=(\d{3})+(?!\d))/g,
                  ',',
                ); // 세 자리마다 콤마 추가
                setAmount(formattedValue);
              }}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    backgroundColor: colors.WHITE,
    borderRadius: 20,
    paddingHorizontal: 10,
    width: '50%',
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
    backgroundColor: colors.LIGHTGRAY,
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
    backgroundColor: colors.GREEN_700,
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
    backgroundColor: colors.GREEN_700,
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
  searchResultItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  noResultsContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  registerButton: {
    backgroundColor: colors.GREEN_700,
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  registerButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
  },
});

export default EventDetailScreen;
