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
import Icon from 'react-native-vector-icons/Ionicons'; // 연필 아이콘을 사용하기 위해 추가

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

  // 이벤트 제목에 따른 배경색 설정 (eventTitle에 적용)
  const getEventTitleStyle = (eventTitle: string) => {
    switch (eventTitle.trim().toLowerCase()) {
      case '친구 결혼':
        return {backgroundColor: '#ffc0cb', color: '#fff'}; // 분홍색 배경, 흰색 글자
      case '내 생일':
        return {backgroundColor: '#97deb3', color: '#fff'}; // 옅은 연두색 배경, 흰색 글자
      case '돌잔치':
        return {backgroundColor: '#87CEFA', color: '#fff'}; // 하늘색 배경, 흰색 글자
      case '장례식':
        return {backgroundColor: '#A9A9A9', color: '#fff'}; // 옅은 검은색 배경, 흰색 글자
      default:
        return {backgroundColor: '#9aa160', color: '#fff'}; // 기본값 노란색 배경, 흰색 글자
    }
  };

  // 렌더링할 이벤트 아이템을 정의
  const renderItem = ({item}: {item: Event}) => {
    return (
      <View style={styles.eventBox}>
        {/* 행사 이름과 연필 아이콘을 수평으로 배치 */}
        <View style={styles.eventHeader}>
          <View
            style={[
              styles.eventTitleContainer,
              getEventTitleStyle(item.category),
            ]}>
            <Text style={styles.eventTitle}>{item.name}</Text>
          </View>
          {/* 연필 모양의 수정 아이콘 추가 */}
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => {
              console.log('수정 버튼 클릭됨');
              // 이후 수정 화면으로 이동하는 코드를 추가할 수 있음
            }}>
            <Icon name="pencil" size={20} color="#808080" />
          </TouchableOpacity>
        </View>

        {/* 카테고리 (배경색 없음) */}
        <View style={styles.eventCategoryContainer}>
          <Text style={styles.eventCategory}>{item.category}</Text>
        </View>

        {/* 날짜 정보 */}
        <Text style={styles.eventDate}>
          {new Date(item.eventTime).toLocaleString()}
        </Text>
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
      {/* 상단 헤더 부분 추가 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>내 이벤트 목록</Text>
      </View>

      {events.length > 0 ? (
        <FlatList
          data={events}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          numColumns={2} // 2개의 열로 이벤트를 배치
          columnWrapperStyle={styles.row} // 각 행의 스타일 설정
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
    flex: 1, // Flexbox를 사용하여 각 이벤트가 동일한 비율로 크기를 차지하도록 설정
    marginHorizontal: 8, // 좌우 간격 추가
  },
  row: {
    justifyContent: 'space-between', // 각 행의 이벤트들이 양쪽에 배치되도록 설정
  },
  eventHeader: {
    flexDirection: 'row', // 행으로 배치하여 제목과 수정 아이콘을 수평으로 배치
    justifyContent: 'space-between', // 수정 버튼과 제목을 양 끝에 배치
    alignItems: 'center',
  },
  eventCategoryContainer: {
    borderRadius: 4, // 배경색 없음
    padding: 4, // 텍스트 주위에 여백 추가
    marginBottom: 8, // 카테고리와 제목 사이 여백
  },
  eventCategory: {
    fontSize: 18, // 카테고리를 작게
    fontWeight: 'bold',
    color: '#000', // 검은색 글자
  },
  eventTitleContainer: {
    borderRadius: 4, // 배경색 영역의 모서리를 둥글게 처리
    paddingVertical: 5, // 세로 방향 여백
    paddingHorizontal: 16, // 가로 방향 여백
    marginBottom: 8, // 아래쪽 여백
    justifyContent: 'center', // 세로 방향 중앙 정렬
    alignItems: 'center', // 가로 방향 중앙 정렬
  },
  eventTitle: {
    fontSize: 15, // 행사 제목을 더 크게 설정
    fontWeight: 'bold',
  },
  eventDate: {
    fontSize: 15,
    color: '#888',
    fontWeight: 'bold',
    marginTop: 4, // 날짜와의 간격을 추가
  },
  editButton: {
    paddingHorizontal: 8, // 수정 아이콘의 좌우 여백
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
