import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, FlatList, ActivityIndicator, TouchableOpacity, TextInput } from 'react-native';
import axiosInstance from '@/api/axios';
import { colors } from '@/constants';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { friendsNavigations } from '@/constants/navigations';

interface Friend {
  guestId: number;
  name: string;
  category: string;
  phoneNumber: string | null;
}

interface FriendsListScreenProps {}

function FriendsListScreen({}: FriendsListScreenProps) {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [filteredFriends, setFilteredFriends] = useState<Friend[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();

  const fetchFriends = useCallback(async (page: number) => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await axiosInstance.get('/participant', {
        params: { size: 10, page },
      });
      const newFriends = response.data.data;
      setFriends(prevFriends => (page === 1 ? newFriends : [...prevFriends, ...newFriends]));
      setFilteredFriends(prevFriends => (page === 1 ? newFriends : [...prevFriends, ...newFriends]));
      setCurrentPage(page);
      setHasMore(newFriends.length === 10);
    } catch (error) {
      console.error('친구 목록을 불러오는 데 실패했습니다:', error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore]);

  const searchFriends = useCallback(async (query: string) => {
    if (!query) {
      setFilteredFriends(friends);
      return;
    }
  
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/participant/same`, {
        params: { name: query },
      });
  
      // 검색 결과가 없으면 빈 배열로 설정
      if (response.data.length === 0) {
        setFilteredFriends([]);
      } else {
        setFilteredFriends(response.data); // 검색 결과가 있으면 설정
      }
    } catch (error) {
      console.error('친구 검색에 실패했습니다:', error);
      setFilteredFriends([]); // 에러 발생 시 빈 배열로 초기화
    } finally {
      setLoading(false);
    }
  }, [friends]);
  


  useFocusEffect(
    useCallback(() => {
      fetchFriends(1); 
    }, [])
  );

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      console.log('검색 쿼리:', searchQuery);  // 검색 쿼리 로그
      searchFriends(searchQuery);
    }, 300);
  
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, searchFriends]);
  

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
        return colors.WHITE; // 가족, 친구, 직장의 경우 텍스트 색상을 흰색으로 설정
      default:
        return '#333'; // 기본 회색
    }
  };

  const renderFriendCard = ({ item }: { item: Friend }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate(friendsNavigations.FREINDS_DETAIL, {
        guestId: item.guestId,
        name: item.name,
        category: item.category,
        phoneNumber: item.phoneNumber
      })}
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
      <TextInput
        style={styles.searchInput}
        placeholder="지인 이름 또는 전화번호로 검색"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={filteredFriends}
        renderItem={renderFriendCard}
        keyExtractor={(item) => item.guestId.toString()}
        onEndReached={() => fetchFriends(currentPage + 1)}
        onEndReachedThreshold={0.1}
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
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 10,
    marginBottom: 16,
    backgroundColor: 'white',
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
    color: colors.GREEN_700
  },
});

export default FriendsListScreen;
