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

  // 이벤트 카테고리에 따른 색상을 설정하는 함수
  const getEventTypeStyle = (name: string) => {
    // 디버깅용으로 name 값을 출력
    console.log(`name: '${name}'`);
    // name에 따라 배경색을 결정
    switch (name.trim().toLowerCase()) {
      case '결혼':
        return {backgroundColor: '#ffc0cb'}; // 분홍색
      case '돌잔치':
        return {backgroundColor: '#87CEFA'}; // 하늘색
      case '장례식':
        return {backgroundColor: '#A9A9A9'}; // 옅은 검은색
      case '생일':
        return {backgroundColor: '#97deb3'}; // 옅은 연두색
      default:
        return {backgroundColor: '#9aa160'}; // 기본값 노란색
    }
  };
  const renderItem = ({item}: {item: Event}) => (
    <TouchableOpacity
      style={styles.eventBox}
      onPress={() =>
        navigation.navigate(eventNavigations.EVENT_DETAIL, {event_id: item.id})
      }>
      <Text style={[styles.eventType, getEventTypeStyle(item.name)]}>
        {item.category}
      </Text>
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
      {/* 상단 헤더 부분 추가 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>내 이벤트 목록</Text>
      </View>

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
  header: {
    paddingTop: 10, // 상태바 아래로부터 패딩
    paddingBottom: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
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
    borderRadius: 16,
    marginBottom: 16,
  },
  eventType: {
    paddingVertical: 5, // 상하 패딩
    paddingHorizontal: 15, // 좌우 패딩을 따로 설정하여 조절 가능
    borderRadius: 4,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 12,
    alignSelf: 'flex-start', // 내용에 맞게 좌우 길이를 줄임
  },
  eventDetails: {
    flexDirection: 'row', // 같은 줄에 텍스트 배치
    justifyContent: 'space-between', // 텍스트 사이에 공간 배치
    alignItems: 'center', // 텍스트 높이 맞춤
    marginBottom: 4, // 필요하면 하단 여백 추가
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1, // flex를 통해 공간을 차지하도록 설정
    paddingLeft: 10,
  },
  eventDate: {
    fontSize: 15,
    color: '#888',
    fontWeight: 'bold',
    textAlign: 'right', // 날짜를 오른쪽 정렬
    flex: 1, // flex를 통해 남은 공간을 차지
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
