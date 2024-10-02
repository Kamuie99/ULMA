//홈 화면 다음 랜딩 페이지(패스오더카피 페이지)
import React, {useCallback, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import EventScreen from '../Events/EventScreen';
import axiosInstance from '@/api/axios';
import useAuthStore from '@/store/useAuthStore';
import {colors} from '@/constants';
import Icon from 'react-native-vector-icons/Entypo';
import CalendarComponent from '@/components/calendar/CalendarButton';

const {width} = Dimensions.get('window');

interface Birthday {
  id: string;
  date: string;
  event: string;
  name: string;
}

// 생일 데이터 예시
// const birthdays: Birthday[] = [
//   {id: '1', date: '09.11', event: '생일', name: '홍길동'},
//   {id: '2', date: '09.12', event: '생일', name: '김철수'},
//   {id: '3', date: '09.13', event: '생일', name: '이영희'},
//   // 더 많은 데이터 추가
// ];

const eventList = [];

const LandingPage: React.FC = () => {
  const navigation = useNavigation();

  const {accessToken} = useAuthStore();
  useFocusEffect(
    useCallback(() => {
      const fetchRecentSchedule = async () => {
        try {
          const response = await axiosInstance.get('/schedule/recent', {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          console.log(response.data); // API에서 받은 데이터로 상태 업데이트
          eventList.push(...response.data);
        } catch (error) {
          console.error('일정 목록을 불러오는 중 오류 발생:', error);
          console.log(accessToken);
        }
      };

      fetchRecentSchedule();
    }, []),
  );

  // 일정 관리 바로가기 버튼 핸들러
  const handleScheduleNavigation = () => {
    // navigation.navigate('SchedulePage'); // 네비게이션 경로를 적절하게 설정
  };

  return (
    <View style={styles.container}>
      {/* 일정 관리 바로가기 버튼 */}
      {/* <View style={styles.scheduleContainer}>
        <Text style={styles.scheduleText}>일정 관리 바로가기</Text>
        <TouchableOpacity onPress={handleScheduleNavigation}>
          <Icon name="chevron-right" size={24} color={colors.GREEN_700} />
        </TouchableOpacity>
      </View> */}

      {/* 캘린더 */}
      <View>
        <CalendarComponent />
      </View>

      {/* 가로 스크롤 가능한 생일 목록 */}
      <View>
        {eventList.length > 0 ? (
          <FlatList
            data={eventList}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({item}) => (
              <View style={styles.birthdayBox}>
                <Text style={styles.dateText}>{item.date}</Text>
                <Text style={styles.eventText}>{item.name}</Text>
                <Text style={styles.nameText}>{item.guestName}</Text>
              </View>
            )}
            keyExtractor={item => item.id}
          />
        ) : (
          <View style={styles.birthdayBox}>
            <Text style={styles.emptyMsg}>
              등록된{'\n'}이벤트가{'\n'}없습니다👀
            </Text>
          </View>
        )}
      </View>

      {/* ULMA 페이 바로가기 예시 */}
      <View style={styles.ulmaContainer}>
        <TouchableOpacity onPress={() => console.log('ULMA 페이로 이동')}>
          <Text style={styles.ulmaText}>ULMA 페이 바로가기 &gt;</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchContainer: {
    backgroundColor: colors.LIGHTGRAY,
    padding: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    fontSize: 16,
    flex: 1,
    padding: 8,
  },
  scheduleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  scheduleText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  birthdayBox: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
    alignItems: 'center',
    width: width * 0.3,
  },
  dateText: {
    fontSize: 12,
    color: '#888',
  },
  eventText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 4,
  },
  emptyMsg: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 10,
  },
  nameText: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  ulmaContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  ulmaImage: {
    width: width * 0.8,
    height: 150,
    resizeMode: 'contain',
  },
  ulmaText: {
    fontSize: 16,
    color: '#888',
    marginTop: 8,
  },
});

export default LandingPage;
