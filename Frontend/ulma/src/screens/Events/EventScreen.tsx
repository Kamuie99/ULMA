//이벤트모아보기페이지

import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {NavigationProp, useFocusEffect} from '@react-navigation/native';
import axiosInstance from '@/api/axios'; // axiosInstance 불러오기
import {eventNavigations} from '@/constants/navigations';

interface Event {
  id: string;
  category: string;
  name: string;
  eventTime: string;
}

const EventScreen = ({navigation}: {navigation: NavigationProp<any>}) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // 이벤트 목록 가져오기
  const fetchEvents = async () => {
    try {
      const response = await axiosInstance.get('/events');
      console.log('응답 데이터:', response.data); // API 응답 디버깅
      setEvents(response.data.data); // API에서 받은 데이터로 상태 업데이트
      setLoading(false);
    } catch (error) {
      console.error('이벤트 목록을 불러오는 중 오류 발생:', error);
      Alert.alert('에러', '이벤트 목록을 불러오는 중 오류가 발생했습니다.');
      setLoading(false);
    }
  };

  // 페이지가 포커스를 받을 때마다 이벤트 목록을 새로고침
  useFocusEffect(
    useCallback(() => {
      fetchEvents();
    }, []),
  );

  const renderItem = ({item}: {item: Event}) => (
    <TouchableOpacity
      style={styles.eventBox}
      onPress={() => navigation.navigate('++상세보기++')}>
      <Text style={styles.eventType}>{item.category}</Text>
      <View style={styles.eventDetails}>
        <Text style={styles.eventTitle}>{item.name}</Text>
        <Text style={styles.eventDate}>
          {new Date(item.eventTime).toLocaleString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>로딩 중...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {events.length > 0 ? (
        <FlatList
          data={events}
          keyExtractor={item => item.id}
          renderItem={renderItem}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text>등록된 이벤트가 없습니다.</Text>
        </View>
      )}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate(eventNavigations.EVENT_ADD)}>
        <Text style={styles.addButtonText}>이벤트 추가하기</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // 화면을 채우기 위해 flex: 1 추가
    padding: 16,
    backgroundColor: '#fff',
  },
  addButton: {
    backgroundColor: '#00C77F',
    padding: 16,
    borderRadius: 8,
    marginTop: 'auto', // 버튼을 하단으로 밀어내기
    marginBottom: 16, // 하단에서 약간의 여백 추가
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  eventBox: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  eventType: {
    backgroundColor: '#ffc0cb',
    padding: 4,
    borderRadius: 4,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  eventDetails: {
    flexDirection: 'column',
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  eventDate: {
    fontSize: 14,
    color: '#888',
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
});

export default EventScreen;
