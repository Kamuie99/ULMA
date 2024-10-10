import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Modal,
  TouchableOpacity,
  TextInput,
  Alert,
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
import FriendTag from '@/components/common/FriendTag';
import useEventStore from '@/store/useEventStore';
import Toast from 'react-native-toast-message';

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
  const {eventID} = useEventStore();
  const [guests, setGuests] = useState<Guest[]>([]);
  const [filteredGuests, setFilteredGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [preGuestID, setPreGuestID] = useState<number | null>(null);
  const [newGuestID, setNewGuestID] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [nameSuggestions, setNameSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isNewGuest, setIsNewGuest] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [inputOptionModalVisible, setInputOptionModalVisible] = useState(false);
  const [modalSearchQuery, setModalSearchQuery] = useState('');
  const [amount, setAmount] = useState('');
  const [searchResults, setSearchResults] = useState<Guest[]>([]);

  const fetchEventDetail = async (newPage = 1, resetData = false) => {
    if (!hasMoreData || isFetchingMore) return;

    try {
      setIsFetchingMore(true);
      const response = await axiosInstance.get(
        `/events/detail/${eventID}?page=${newPage}`,
      );
      const newGuests = response.data.data;

      setGuests(prevGuests =>
        resetData ? newGuests : [...prevGuests, ...newGuests],
      );
      setFilteredGuests(prevGuests =>
        resetData ? newGuests : [...prevGuests, ...newGuests],
      );

      if (newGuests.length === 0 || response.data.totalPages <= newPage) {
        setHasMoreData(false);
      }

      setLoading(false);
      setIsFetchingMore(false);
    } catch (error) {
      console.error('이벤트 상세 내역을 불러오는 중 오류 발생:', error);
      Toast.show({
        type: 'error',
        text1: '내역 불러오는 중 오류 발생',
      });
      setLoading(false);
      setIsFetchingMore(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setPage(1);
      setHasMoreData(true);
      fetchEventDetail(1, true);
    }, [eventID]),
  );

  useEffect(() => {
    if (!modalVisible) {
      fetchEventDetail(1, true);
    }
  }, [modalVisible]);

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

  const loadMoreData = () => {
    if (!isFetchingMore && hasMoreData) {
      fetchEventDetail(page + 1);
      setPage(prevPage => prevPage + 1);
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
          eventId: eventID,
          guestId: selectedGuest?.guestId,
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
              `/events/detail/${eventID}?page=1`,
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
    setSelectedGuest({guestId, guestName, category, amount: 0});
    setModalSearchQuery(`${guestName} (${category})`);
    setSearchResults([]);
  };

  const handleModalClose = () => {
    setSelectedGuest(null);
    setModalVisible(false);
  };

  const renderGuestModal = () => {
    return (
      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={handleModalClose}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.input}
              placeholder="지인 검색(중복 검색)"
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
              onPress={handleModalClose}>
              <Text style={styles.cancelButtonText}>취소</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      {guests.length > 0 && (
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
                onSubmitEditing={searchModalUser}
              />
            )}
          </View>

          {!searchExpanded && (
            <TouchableOpacity
              onPress={() => setSearchExpanded(true)}
              style={styles.searchButton}>
              <Icon name="search" size={20} color={colors.GRAY_700} />
            </TouchableOpacity>
          )}
        </View>
      )}

      <FlatList
        data={filteredGuests}
        keyExtractor={(item, index) => `${item.guestId}-${index}`}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => {
              setSelectedGuest(item);
              setModalVisible(true);
            }}>
            <View style={styles.guestBox}>
              <View style={styles.guestRow}>
                <View style={{flexDirection: 'row', gap: 10}}>
                  <FriendTag label={item.category} />
                  <Text style={styles.guestName}>{item.guestName}</Text>
                </View>
                <Text style={styles.guestAmount}>
                  {item.amount.toLocaleString()}원
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        onEndReached={loadMoreData}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetchingMore ? (
            <ActivityIndicator size="small" color={colors.GREEN_700} />
          ) : null
        }
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setInputOptionModalVisible(true)}>
        <Text style={styles.addButtonText}>거래내역 간편 등록</Text>
      </TouchableOpacity>

      {renderGuestModal()}

      <InputOptionModal
        isVisible={inputOptionModalVisible}
        onClose={() => setInputOptionModalVisible(false)}
        onDirectRegister={() => setModalVisible(true)}
        eventId={eventID}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
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
    backgroundColor: colors.LIGHTGRAY,
    borderRadius: 20,
  },
  searchBoxExpanded: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.WHITE,
    borderRadius: 20,
    paddingHorizontal: 10,
    width: '100%',
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
  guestName: {
    fontSize: 16,
    color: colors.BLACK,
    fontWeight: 'bold',
    paddingTop: 3,
  },
  guestAmount: {
    fontSize: 16,
    color: colors.BLACK,
    fontWeight: 'bold',
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    padding: 10,
    backgroundColor: colors.WHITE,
    borderRadius: 10,
    width: '80%',
  },
  input: {
    borderWidth: 1,
    borderColor: colors.GRAY_100,
    borderRadius: 7,
    padding: 10,
    marginBottom: 5,
    fontSize: 16,
    fontWeight: 'bold',
  },
  submitButton: {
    padding: 10,
    backgroundColor: colors.GREEN_700,
    alignItems: 'center',
    borderRadius: 5,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelButton: {
    padding: 10,
    backgroundColor: colors.GRAY_500,
    alignItems: 'center',
    borderRadius: 5,
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default EventDetailScreen;
