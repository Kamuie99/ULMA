import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, ActivityIndicator, TouchableOpacity, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import axiosInstance from '@/api/axios';
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

  const navigation = useNavigation();
  const route = useRoute();
  const isSelectionMode = route.name === homeNavigations.SELECT_FRIEND;

  // 전체 목록 및 검색 결과 불러오기 함수
  const searchFriends = useCallback(async () => {
    setLoading(true);
    try {
      const params: { name?: string; category?: string } = {};
      if (searchQuery.trim()) {
        params.name = searchQuery;
      }
      if (selectedCategory !== '전체') {
        params.category = selectedCategory;
      }

      const response = await axiosInstance.get(`/participant/same`, { params });
      const fetchedFriends = response.data.data || [];

      setFilteredFriends(fetchedFriends);
    } catch (error) {
      console.error('친구 목록을 불러오는 데 실패했습니다:', error);
      setFilteredFriends([]); // 에러 발생 시 빈 리스트로 설정
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCategory]);

  const handleSearch = () => {
    searchFriends();
  };

  // 페이지가 처음 로드될 때 전체 목록 불러오기
  useEffect(() => {
    searchFriends(); // 처음 들어왔을 때 전체 목록을 불러오기
  }, [searchFriends]);

  const formatPhoneNumber = (phoneNumber: string | null) => {
    if (!phoneNumber) return '등록된 번호가 없습니다.';
    return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 7)}-${phoneNumber.slice(7)}`;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case '가족':
        return colors.PINK;
      case '친구':
        return colors.GREEN_700;
      case '직장':
        return colors.PASTEL_BLUE;
      default:
        return '#e0e0e0';
    }
  };

  const getCategoryTextColor = (category: string) => {
    switch (category) {
      case '가족':
      case '친구':
      case '직장':
        return colors.WHITE;
      default:
        return '#333';
    }
  };

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

  const renderFriendCard = ({ item }: { item: Friend }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleFriendSelect(item)}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.name}>{item.name}</Text>
        <TouchableOpacity
          style={[styles.categoryButton, { backgroundColor: getCategoryColor(item.category) }]}
        >
          <Text style={[styles.categoryText, { color: getCategoryTextColor(item.category) }]}>
            {item.category}
          </Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.phoneNumber}>
        Phone <Text style={styles.colorGreen}>|</Text> {formatPhoneNumber(item.phoneNumber)}
      </Text>
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (!loading) return null;
    return <ActivityIndicator size="large" color="#0000ff" />;
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
          <Picker.Item label="학교" value="학교" />
          <Picker.Item label="지인" value="지인" />
          <Picker.Item label="기타" value="기타" />
        </Picker>
        <TextInput
          style={styles.searchInput}
          placeholder="지인 이름 또는 전화번호로 검색"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {/* <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>검색</Text>
        </TouchableOpacity> */}
      </View>
      <FlatList
        data={filteredFriends}
        renderItem={renderFriendCard}
        keyExtractor={(item) => item.guestId.toString()}
        ListFooterComponent={renderFooter}
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
  searchButton: {
    backgroundColor: colors.GREEN_700,
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  searchButtonText: {
    color: 'white',
    fontWeight: 'bold',
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
});

export default FriendsListScreen;
