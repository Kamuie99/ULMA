import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, TextInput, Alert, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Swipeable } from 'react-native-gesture-handler';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import axiosInstance from '@/api/axios';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '@/constants';
import { homeNavigations, friendsNavigations } from '@/constants/navigations';

interface Friend {
  guestId: number;
  name: string;
  category: string;
  phoneNumber: string | null;
}

function FriendsListScreen() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [filteredFriends, setFilteredFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const navigation = useNavigation();
  const route = useRoute();
  const isSelectionMode = route.name === homeNavigations.SELECT_FRIEND;

  const searchFriends = useCallback(async (page = 1) => {
    setLoading(page === 1); 
    setIsFetchingMore(page !== 1);
    try {
      const params: { name?: string; category?: string; page?: number; size?: number } = { page, size: 10 };
      if (searchQuery.trim()) params.name = searchQuery;
      if (selectedCategory !== '전체') params.category = selectedCategory;

      const response = await axiosInstance.get('/participant/same', { params });
      const fetchedFriends = response.data.data || [];
      setFilteredFriends((prevFriends) => 
        page === 1 ? fetchedFriends : [...prevFriends, ...fetchedFriends]
      );
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('친구 목록을 불러오는 데 실패했습니다:', error);
      setFilteredFriends([]);
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
    }
  }, [searchQuery, selectedCategory]);

  useFocusEffect(
    useCallback(() => {
      searchFriends(1);
    }, [searchFriends])
  );

  const loadMoreFriends = () => {
    if (currentPage < totalPages && !loading && !isFetchingMore) {
      searchFriends(currentPage + 1);
    }
  };

  const formatPhoneNumber = (phoneNumber: string | null) => {
    if (!phoneNumber) return '등록된 번호가 없습니다.';
    return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 7)}-${phoneNumber.slice(7)}`;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case '가족': return colors.PINK;
      case '친구': return colors.GREEN_700;
      case '직장': return colors.PASTEL_BLUE;
      default: return '#e0e0e0';
    }
  };

  const renderRightActions = (guestId: number) => (
    <TouchableOpacity
      style={styles.deleteButton}
      onPress={() => confirmDelete(guestId)}
    >
      <Icon name="trash-outline" size={28} color={colors.RED} />
    </TouchableOpacity>
  );

  const confirmDelete = (guestId: number) => {
    Alert.alert(
      "삭제 확인",
      "이 친구를 삭제하시겠습니까?",
      [
        { text: "아니오", style: "cancel" },
        { text: "예", onPress: () => deleteFriend(guestId) },
      ],
      { cancelable: true }
    );
  };

  const deleteFriend = async (guestId: number) => {
    try {
      await axiosInstance.delete(`/relation/${guestId}`);
      setFilteredFriends(prevFriends => prevFriends.filter(friend => friend.guestId !== guestId));
      Alert.alert('삭제 완료', '해당 친구가 삭제되었습니다.');
    } catch (error) {
      console.error('친구 삭제에 실패했습니다:', error);
      Alert.alert('삭제 실패', '친구 삭제에 실패했습니다.');
    }
  };

  const renderFriendCard = ({ item }: { item: Friend }) => (
    <Swipeable renderRightActions={() => renderRightActions(item.guestId)}>
      <TouchableOpacity
        style={styles.card}
        onPress={() => handleFriendSelect(item)}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.name}>{item.name}</Text>
          <TouchableOpacity
            style={[styles.categoryButton, { backgroundColor: getCategoryColor(item.category) }]}
          >
            <Text style={styles.categoryText}>{item.category}</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.phoneNumber}>
          Phone <Text style={styles.colorGreen}>|</Text> {formatPhoneNumber(item.phoneNumber)}
        </Text>
      </TouchableOpacity>
    </Swipeable>
  );

  const handleFriendSelect = (friend: Friend) => {
    if (isSelectionMode) {
      navigation.navigate(homeNavigations.SCHEDULE_ADD, {
        selectedUser: { guestId: friend.guestId, name: friend.name },
      });
    } else {
      navigation.navigate(friendsNavigations.FREINDS_DETAIL, {
        guestId: friend.guestId,
        name: friend.name,
        category: friend.category,
        phoneNumber: friend.phoneNumber,
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Picker
          selectedValue={selectedCategory}
          style={styles.categoryPicker}
          onValueChange={(itemValue) => setSelectedCategory(itemValue)}
        >
          <Picker.Item label="전체" value="전체" />
          <Picker.Item label="가족" value="가족" />
          <Picker.Item label="친구" value="친구" />
          <Picker.Item label="직장" value="직장" />
        </Picker>
        <TextInput
          style={styles.searchInput}
          placeholder="지인 이름으로 검색"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <FlatList
        data={filteredFriends}
        renderItem={renderFriendCard}
        keyExtractor={(item) => item.guestId.toString()}
        ListFooterComponent={isFetchingMore ? <ActivityIndicator size="large" color="#0000ff" /> : null}
        onEndReached={loadMoreFriends}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderBottomColor: colors.GREEN_700,
    borderBottomWidth: 2,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  categoryPicker: {
    height: 40,
    width: 150,
  },
  card: {
    backgroundColor: '#f5f5f5',
    borderRadius: 15,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 3,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: colors.BLACK,
  },
  categoryButton: {
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 14,
    color: colors.WHITE,
  },
  phoneNumber: {
    fontSize: 14,
    color: '#666',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  colorGreen: {
    color: colors.GREEN_700,
  },
  deleteButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
  },
});

export default FriendsListScreen;
