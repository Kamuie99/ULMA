import React, {useCallback, useEffect, useState} from 'react';
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
import {
  RouteProp,
  NavigationProp,
  useFocusEffect,
} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axiosInstance from '@/api/axios';
import {eventStackParamList} from '@/navigations/stack/EventStackNavigator';
import InputOptionModal from '@/screens/Events/InputOptionModal';
import {colors} from '@/constants';

type EventDetailScreenRouteProp = RouteProp<
  eventStackParamList,
  'EVENT_DETAIL'
>;

interface EventDetailScreenProps {
  route: EventDetailScreenRouteProp;
  navigation: NavigationProp<any>;
}

interface Guest {
  guestId: number;
  guestName: string;
  category: string;
  amount: number;
}

const EventDetailScreen: React.FC<EventDetailScreenProps> = ({
  route,
  navigation,
}) => {
  const {event_id} = route.params;
  const [guests, setGuests] = useState<Guest[]>([]);
  const [filteredGuests, setFilteredGuests] = useState<Guest[]>([]);
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
  const [inputOptionModalVisible, setInputOptionModalVisible] = useState(false);

  const fetchEventDetail = async (newPage = 1) => {
    if (!hasMoreData || isFetchingMore) return;

    try {
      setIsFetchingMore(true);
      const response = await axiosInstance.get(
        `/events/detail/${event_id}?page=${newPage}`,
      );
      const newGuests = response.data.data;

      setGuests(prevGuests => [...prevGuests, ...newGuests]);
      setFilteredGuests(prevGuests => [...prevGuests, ...newGuests]);

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
    if (route.params?.refresh) {
      setRefresh(prev => !prev);
    }
  }, [route.params?.refresh]);

  useEffect(() => {
    fetchEventDetail();
  }, [event_id]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredGuests(guests);
    } else {
      const filtered = guests.filter(guest =>
        guest.guestName.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredGuests(filtered);
    }
  }, [searchQuery, guests]);

  const [refresh, setRefresh] = useState(false);
  useFocusEffect(
    useCallback(() => {
      fetchEventDetail(1);
    }, [event_id, refresh]),
  );

  const loadMoreData = () => {
    if (!isFetchingMore && hasMoreData) {
      fetchEventDetail(page + 1);
      setPage(prevPage => prevPage + 1);
    }
  };

  const searchUser = () => {
    if (searchQuery.trim() === '') {
      setFilteredGuests(guests);
    } else {
      const filtered = guests.filter(guest =>
        guest.guestName.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredGuests(filtered);
    }
  };

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
          amount: Number(amount.replace(/,/g, '')),
        },
      ]);

      Alert.alert('성공', '거래내역이 추가되었습니다.', [
        {
          text: 'OK',
          onPress: async () => {
            setModalVisible(false);
            setSelectedGuest(null);
            setModalSearchQuery('');
            setAmount('');
            setPage(1);

            const response = await axiosInstance.get(
              `/events/detail/${event_id}?page=1`,
            );
            setGuests(response.data.data);
            setFilteredGuests(response.data.data);
            setHasMoreData(response.data.totalPages > 1);
          },
        },
      ]);
    } catch (error: any) {
      console.error('오류 발생:', error);

      if (error.response) {
        console.error('응답 데이터:', error.response.data);
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
    setSelectedGuest(guestId);
    setModalSearchQuery(`${guestName} (${category})`);
    setSearchResults([]);
    setExpandedGuests(null);
  };

  const handleOpenModal = () => {
    setModalVisible(true);
    setModalSearchQuery('');
    setAmount('');
    setSearchResults([]);
  };

  const toggleGuestList = (guestId: number) => {
    setExpandedGuests(expandedGuests === guestId ? null : guestId);
  };

  const renderContent = () => {
    if (guests.length === 0 && !loading) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>등록된 거래 내역이 없습니다.</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={filteredGuests}
        keyExtractor={(item, index) => `${item.guestId}-${index}`}
        renderItem={({item}) => (
          <View style={styles.guestBox}>
            <View style={styles.guestRow}>
              <Text style={styles.guestName}>
                {item.guestName} ({item.category})
              </Text>
              <Text style={styles.guestAmount}>
                {'+'}
                {item.amount.toLocaleString()}원
              </Text>
            </View>
          </View>
        )}
        onEndReached={loadMoreData}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetchingMore ? (
            <ActivityIndicator size="small" color={colors.GREEN_700} />
          ) : null
        }
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
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

      {renderContent()}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setInputOptionModalVisible(true)}>
        <Text style={styles.addButtonText}>거래내역 간편 등록</Text>
      </TouchableOpacity>

      <InputOptionModal
        isVisible={inputOptionModalVisible}
        onClose={() => setInputOptionModalVisible(false)}
        onDirectRegister={() => setModalVisible(true)}
        eventId={event_id}
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
              <View style={styles.noResultsContainer}>
                <Text>검색 결과가 없습니다.</Text>
                <TouchableOpacity
                  style={styles.registerButton}
                  onPress={() => {
                    setModalVisible(false);
                    navigation.navigate('FriendsStackNavigator', {
                      screen: 'FriendsAddScreen',
                    });
                  }}>
                  <Text style={styles.registerButtonText}>지인 등록하기</Text>
                </TouchableOpacity>
              </View>
            ) : null}

            <TextInput
              style={styles.input}
              placeholder="금액"
              value={amount.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              onChangeText={text => {
                const rawValue = text.replace(/,/g, '');
                const formattedValue = rawValue.replace(
                  /\B(?=(\d{3})+(?!\d))/g,
                  ',',
                );
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
    justifyContent: 'flex-end',
    marginBottom: 16,
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
  guestRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  guestDetails: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  guestName: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
    flex: 1, // 이름과 카테고리를 왼쪽으로 정렬
  },
  guestCategory: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
  },
  guestAmount: {
    fontSize: 16,
    color: colors.GREEN_700,
    fontWeight: 'bold',
    textAlign: 'right', // 오른쪽으로 정렬
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
