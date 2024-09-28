import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, FlatList, ActivityIndicator, TouchableOpacity, TextInput } from 'react-native';
import axiosInstance from '@/api/axios';
import { colors } from '@/constants';

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

  const fetchFriends = useCallback(async (page: number) => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await axiosInstance.get('/participant', {
        params: { size: 10, page },
      });
      const newFriends = response.data.data;
      setFriends(prevFriends => [...prevFriends, ...newFriends]);
      setFilteredFriends(prevFriends => [...prevFriends, ...newFriends]);
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
      setFilteredFriends(response.data);
    } catch (error) {
      console.error('친구 검색에 실패했습니다:', error);
    } finally {
      setLoading(false);
    }
  }, [friends]);

  useEffect(() => {
    fetchFriends(1);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      searchFriends(searchQuery);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, searchFriends]);

  const formatPhoneNumber = (phoneNumber: string | null) => {
    if (!phoneNumber) return '등록된 번호가 없습니다.';
    return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 7)}-${phoneNumber.slice(7)}`;
  };

  const renderFriendCard = ({ item }: { item: Friend }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.name}>{item.name}</Text>
        <TouchableOpacity style={styles.categoryButton}>
          <Text style={styles.categoryText}>{item.category}</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.phoneNumber}>
        Phone <Text style={styles.colorGreen}>|</Text> {formatPhoneNumber(item.phoneNumber)}
      </Text>
    </View>
  );

  const renderFooter = () => {
    if (!loading) return null;
    return <ActivityIndicator size="large" color="#0000ff" />;
  };

  const handleLoadMore = () => {
    if (!loading && hasMore && searchQuery === '') {
      fetchFriends(currentPage + 1);
    }
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
        keyExtractor={item => item.guestId.toString()}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
        extraData={filteredFriends}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: colors.BLACK,
  },
  categoryButton: {
    backgroundColor: '#e0e0e0',
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 14,
    color: '#333',
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
  }
});

export default FriendsListScreen;