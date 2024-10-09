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
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null); // 선택된 guest 저장
  const [preGuestID, setPreGuestID] = useState<number | null>(null); // 모달 켤 때 저장할 preGuestID
  const [newGuestID, setNewGuestID] = useState<number | null>(null); // 수정 후 저장할 newGuestID
  const [page, setPage] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [nameSuggestions, setNameSuggestions] = useState([]); // 이름 추천 리스트
  const [showDropdown, setShowDropdown] = useState(false); // 드롭다운 표시 여부
  const [isNewGuest, setIsNewGuest] = useState(false); // 새로운 사람인지 여부
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [inputOptionModalVisible, setInputOptionModalVisible] = useState(false); // InputOptionModal 상태

  const fetchEventDetail = async (newPage = 1, resetData = false) => {
    if (!hasMoreData || isFetchingMore) return;

    try {
      setIsFetchingMore(true);
      const response = await axiosInstance.get(
        `/events/detail/${eventID}?page=${newPage}`,
      );
      const newGuests = response.data.data;

      // resetData가 true일 때만 데이터를 초기화하고, 그렇지 않으면 추가
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

  // 화면에 포커스가 돌아왔을 때 데이터 불러오기
  useFocusEffect(
    useCallback(() => {
      setPage(1);
      setHasMoreData(true);
      fetchEventDetail(1, true); // 초기화하고 첫 페이지 데이터 불러옴
    }, [eventID]),
  );

  // 모달이 닫혔을 때 데이터 다시 불러오기
  useEffect(() => {
    if (!modalVisible) {
      fetchEventDetail(1, true); // 첫 번째 페이지를 다시 불러오면서 초기화
    }
  }, [modalVisible]);

  // 검색어에 따른 필터링
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

  // 이름 검색 함수
  const fetchNameSuggestions = async (name: string) => {
    try {
      const response = await axiosInstance.get('/participant/same', {
        params: {name},
      });
      setNameSuggestions(response.data.data);
      setShowDropdown(true);
    } catch (error) {
      console.error('이름 추천을 불러오는 중 오류 발생:', error);
    }
  };

  // 저장 버튼 함수
  const handleSave = async () => {
    try {
      const preGuestId = preGuestID;
      let guestId = preGuestID; // 기존 guestId 또는 새로 추가된 guestId를 저장

      if (isNewGuest && selectedGuest) {
        try {
          const newGuest = [
            {
              name: selectedGuest.guestName,
              category: '기타',
            },
          ];

          // 새로운 사람 등록
          try {
            await axiosInstance.post('/participant', newGuest);
          } catch (error) {
            console.error('POST 요청 중 오류 발생:', error);
            Toast.show({
              type: 'error',
              text1: '새로운 사람 등록 중 오류가 발생했습니다.',
            });
            return;
          }

          // 새로 등록된 사람을 다시 검색해서 guestId 가져오기
          try {
            const searchAfterRegisterResponse = await axiosInstance.get(
              '/participant/same',
              {
                params: {name: selectedGuest.guestName}, // 이름으로 검색
              },
            );

            // 검색 결과에서 첫 번째 사람의 guestId 가져오기
            guestId = searchAfterRegisterResponse.data.data[0].guestId;
            setNewGuestID(guestId); // 새로 등록된 guestId 저장

            Toast.show({
              type: 'success',
              text1: '새로운 사람이 등록되었습니다.',
            });
          } catch (error) {
            console.error('검색 중 오류 발생:', error);
            Toast.show({
              type: 'error',
              text1: '새로 등록된 사람 검색 중 오류가 발생했습니다.',
            });
            return;
          }
        } catch (error) {
          console.error('새로운 사람 등록 처리 중 오류 발생:', error);
          Toast.show({
            type: 'error',
            text1: '등록 처리 중 오류가 발생했습니다.',
          });
        }
      }

      // 기존 사람 또는 새로 등록된 사람의 guestId로 PUT 요청
      if (guestId && selectedGuest) {
        try {
          await axiosInstance.put('/participant', {
            eventId: eventID,
            guestId: guestId, // 새로 등록된 사람 또는 기존 사람의 guestId
            amount: selectedGuest.amount,
            preGuestId: preGuestId, // 수정 전의 guestId
          });

          Toast.show({
            type: 'success',
            text1: '정보가 수정되었습니다.',
          });
        } catch (error) {
          console.log(guestId, preGuestId);
          console.error('정보 수정 중 오류 발생:', error);
          Toast.show({
            type: 'error',
            text1: '정보 수정 중 오류가 발생했습니다.',
          });
        }
      }

      setModalVisible(false); // 모달 닫기
      fetchEventDetail(1, true); // 데이터를 다시 불러오면서 화면 재렌더링
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: '저장에 실패하였습니다.',
      });
    }
  };

  // 모달 상태 초기화
  const handleModalClose = () => {
    setSelectedGuest(null); // 선택된 게스트 초기화
    setIsNewGuest(false); // 새로운 사람 상태 초기화
    setModalVisible(false); // 모달 닫기
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
          <TouchableOpacity
            onPress={() => {
              setSelectedGuest(item);
              setPreGuestID(item.guestId); // 모달 켤 때 선택한 사람의 guestId를 preGuestId로 저장
              setModalVisible(true);
              setIsNewGuest(false);
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
    );
  };

  // 모달창 함수
  const renderGuestModal = () => {
    if (!selectedGuest) return null;

    return (
      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => handleModalClose()}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* 이름 수정 가능 */}
            <TextInput
              style={styles.modalInput}
              value={selectedGuest?.guestName || ''}
              onChangeText={text => {
                setSelectedGuest(prevGuest =>
                  prevGuest ? {...prevGuest, guestName: text} : null,
                );
                fetchNameSuggestions(text); // 이름 입력 시 추천 목록 요청
                setIsNewGuest(true); // 새로운 사람으로 처리
              }}
            />

            {/* 드롭다운 리스트 */}
            {showDropdown && nameSuggestions.length > 0 && (
              <FlatList
                data={nameSuggestions}
                keyExtractor={item => item.guestId.toString()}
                renderItem={({item}) => (
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => {
                      setSelectedGuest(prevGuest =>
                        prevGuest
                          ? {
                              ...prevGuest,
                              guestName: item.name,
                              category: item.category,
                              guestId: item.guestId, // 선택된 사람의 ID 설정
                            }
                          : null,
                      );
                      setNewGuestID(item.guestId); // 선택된 사람의 guestId를 newGuestId로 저장
                      setShowDropdown(false); // 드롭다운 닫기
                      setIsNewGuest(false); // 기존 사람으로 처리
                    }}>
                    <View style={{flexDirection: 'row', gap: 10}}>
                      <FriendTag label={item.category} />
                      <Text style={styles.guestName}>{item.name}</Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
            )}

            {/* 금액 수정 가능 */}
            <TextInput
              style={styles.modalInput}
              value={selectedGuest?.amount?.toString() || ''}
              keyboardType="numeric"
              onChangeText={text =>
                setSelectedGuest(prevGuest =>
                  prevGuest
                    ? {
                        ...prevGuest,
                        amount: parseInt(text.replace(/,/g, ''), 10),
                      }
                    : null,
                )
              }
            />

            {/* 저장 버튼 */}
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>저장</Text>
            </TouchableOpacity>

            {/* 닫기 버튼 */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => handleModalClose()}>
              <Text style={styles.closeButtonText}>닫기</Text>
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
                onSubmitEditing={searchUser}
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

      {renderContent()}

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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  emptyText: {
    fontSize: 16,
    color: colors.GRAY_700,
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
  modalInput: {
    borderWidth: 1,
    borderColor: colors.GRAY_100,
    borderRadius: 7,
    padding: 10,
    marginBottom: 5,
    fontSize: 16,
    fontWeight: 'bold',
  },
  dropdownItem: {
    padding: 10,
  },
  saveButton: {
    padding: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: colors.GREEN_700,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: colors.GRAY_700,
  },
});

export default EventDetailScreen;
