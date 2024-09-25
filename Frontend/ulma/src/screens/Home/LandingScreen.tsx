//홈 화면 다음 랜딩 페이지(패스오더카피 페이지)
import React from 'react';
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
import {useNavigation} from '@react-navigation/native';

const {width} = Dimensions.get('window');

interface Birthday {
  id: string;
  date: string;
  event: string;
  name: string;
}

// 생일 데이터 예시
const birthdays: Birthday[] = [
  {id: '1', date: '09.11', event: '생일', name: '홍길동'},
  {id: '2', date: '09.12', event: '생일', name: '김철수'},
  {id: '3', date: '09.13', event: '생일', name: '이영희'},
  // 더 많은 데이터 추가
];

const LandingPage: React.FC = () => {
  const navigation = useNavigation();

  // 일정 관리 바로가기 버튼 핸들러
  const handleScheduleNavigation = () => {
    // navigation.navigate('SchedulePage'); // 네비게이션 경로를 적절하게 설정
  };

  return (
    <View style={styles.container}>
      {/* 친구 검색 박스 */}
      <View style={styles.searchContainer}>
        <TextInput style={styles.searchInput} placeholder="친구 검색" />
      </View>

      {/* 일정 관리 바로가기 버튼 */}
      <View style={styles.scheduleContainer}>
        <Text style={styles.scheduleText}>일정 관리 바로가기</Text>
        <TouchableOpacity onPress={handleScheduleNavigation}>
          <Text style={styles.arrowText}> &gt; </Text>
        </TouchableOpacity>
      </View>

      {/* 가로 스크롤 가능한 생일 목록 */}
      <FlatList
        data={birthdays}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({item}) => (
          <View style={styles.birthdayBox}>
            <Text style={styles.dateText}>{item.date}</Text>
            <Text style={styles.eventText}>{item.event}</Text>
            <Text style={styles.nameText}>{item.name}</Text>
          </View>
        )}
        keyExtractor={item => item.id}
      />

      {/* ULMA 페이 바로가기 예시 */}
      <View style={styles.ulmaContainer}>
        {/* <Image
          source={require('./path_to_ulma_image.png')}
          style={styles.ulmaImage}
        /> */}
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
    backgroundColor: '#fff',
    padding: 16,
  },
  searchContainer: {
    backgroundColor: '#f1f1f1',
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
  arrowText: {
    fontSize: 16,
    color: '#00C77F',
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
