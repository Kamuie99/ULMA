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
import axiosInstance from '@/api/axios';
import {eventNavigations} from '@/constants/navigations';
import Icon from 'react-native-vector-icons/Ionicons';

interface Event {
  id: string;
  category: string;
  name: string;
  eventTime: string;
}

const EventScreen = ({navigation}: {navigation: NavigationProp<any>}) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchEvents = async () => {
    try {
      const response = await axiosInstance.get('/events');
      console.log('응답 데이터:', response.data);
      setEvents(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('이벤트 목록을 불러오는 중 오류 발생:', error);
      Alert.alert('에러', '이벤트 목록을 불러오는 중 오류가 발생했습니다.');
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchEvents();
    }, []),
  );

  // eventTitle 값에 따라 배경색을 변경
  const getEventTitleStyle = (eventTitle: string) => {
    switch (eventTitle.trim().toLowerCase()) {
      case '결혼':
        return {backgroundColor: '#ffc0cb', color: '#fff'};
      case '생일':
        return {backgroundColor: '#97deb3', color: '#fff'};
      case '돌잔치':
        return {backgroundColor: '#87CEFA', color: '#fff'};
      case '장례식':
        return {backgroundColor: '#A9A9A9', color: '#fff'};
      default:
        return {backgroundColor: '#9aa160', color: '#fff'};
    }
  };

  // 날짜를 '2024년 8월 11일' 형식으로 변환
  const formatKoreanDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}년 ${
      date.getMonth() + 1
    }월 ${date.getDate()}일`;
  };

  // 시간을 '14시 30분' 형식으로 변환
  const formatKoreanTime = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getHours()}시 ${date.getMinutes()}분`;
  };

  const renderItem = ({item}: {item: Event}) => {
    return (
      <View style={styles.eventContainer}>
        {/* 박스를 클릭했을 때 EventDetailScreen으로 이동 */}
        <TouchableOpacity
          style={styles.eventBox}
          onPress={() =>
            navigation.navigate(eventNavigations.EVENT_DETAIL, {
              event_id: item.id,
              category: item.category,
              name: item.name,
              eventTime: item.eventTime,
            })
          }>
          <View style={styles.eventHeader}>
            <View
              style={[
                styles.eventTitleContainer,
                getEventTitleStyle(item.name), // name에 따라 배경색 변경
              ]}>
              <Text style={styles.eventTitle}>{item.name}</Text>
            </View>
          </View>

          <View style={styles.eventCategoryContainer}>
            <Text style={styles.eventCategory}>{item.category}</Text>
          </View>

          <Text style={styles.eventDate}>
            {formatKoreanDate(item.eventTime)} {'\n'}
            {formatKoreanTime(item.eventTime)}
          </Text>
        </TouchableOpacity>

        {/* 연필 모양 버튼을 클릭했을 때 EventFixScreen으로 이동 */}
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => {
            console.log('Navigating to EVENT_FIX with event_id:', item.id);
            navigation.navigate(eventNavigations.EVENT_FIX, {
              event_id: item.id,
              category: item.category,
              name: item.name,
              eventTime: item.eventTime,
            });
          }}>
          <Icon name="pencil" size={20} color="#808080" />
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>로딩 중...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 상단 헤더 부분 추가
      <View style={styles.header}>
        <Text style={styles.headerTitle}>내 이벤트 목록</Text>
      </View> */}

      {events.length > 0 ? (
        <FlatList
          data={events}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={styles.row}
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
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: 10,
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
    marginTop: 'auto',
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  eventContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  eventBox: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    flex: 1,
    marginHorizontal: 8,
  },
  row: {
    justifyContent: 'space-between',
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventCategoryContainer: {
    borderRadius: 4,
    padding: 4,
    marginBottom: 8,
  },
  eventCategory: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  eventTitleContainer: {
    borderRadius: 4,
    paddingVertical: 5,
    paddingHorizontal: 16,
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventTitle: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  eventDate: {
    fontSize: 15,
    color: '#888',
    fontWeight: 'bold',
    marginTop: 4,
  },
  editButton: {
    paddingHorizontal: 8,
    position: 'absolute',
    right: 10,
    top: 10,
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
