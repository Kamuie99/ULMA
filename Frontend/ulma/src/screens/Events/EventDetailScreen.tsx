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

  // useFocusEffect로 목록 업데이트
  useFocusEffect(
    useCallback(() => {
      setGuests([]);
      setPage(1);
      setHasMoreData(true);
      fetchEventDetail(1);
    }, [event_id]),
  );

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
            <Icon name="search" size={20} color={colors.GRAY_700} />
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
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
  },
  searchBoxExpanded: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.WHITE,
    borderRadius: 20,
    paddingHorizontal: 10,
    width: '100%', // 검색창 width를 100%로 수정
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
    color: '#333',
    fontWeight: 'bold',
  },
  guestAmount: {
    fontSize: 16,
    color: colors.GREEN_700,
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
    color: '#888',
  },
});

export default EventDetailScreen;
