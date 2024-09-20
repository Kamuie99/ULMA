//이벤트 모아보기 페이지
import React from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {NavigationProp} from '@react-navigation/native';
import BottomBar from 'src/components/common/BottomBar'; // 하단바 컴포넌트 임포트

interface Event {
  id: string;
  type: string;
  title: string;
  date: string;
  amount: string;
}

const events: Event[] = [
  {
    id: '1',
    type: '결혼',
    title: '친구 결혼식',
    date: '2024-08-29',
    amount: '1,234,500 원',
  },
  {
    id: '2',
    type: '생일',
    title: '내 생일',
    date: '2024-08-04',
    amount: '150,000 원',
  },
  {
    id: '3',
    type: '돌잔치',
    title: '내 돌잔치',
    date: '1998-10-01',
    amount: '2,150,000 원',
  },
];

const EventPage = ({navigation}: {navigation: NavigationProp<any>}) => {
  const renderItem = ({item}: {item: Event}) => (
    <TouchableOpacity
      style={styles.eventBox}
      onPress={() => navigation.navigate('++상세보기++')}>
      <Text style={styles.eventType}>{item.type}</Text>
      <View style={styles.eventDetails}>
        <Text style={styles.eventTitle}>{item.title}</Text>
        <Text style={styles.eventDate}>{item.date}</Text>
        <Text style={styles.eventAmount}>{item.amount}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('++다음페이지++')}>
        <Text style={styles.addButtonText}>이벤트 추가하기</Text>
      </TouchableOpacity>
      <FlatList
        data={events}
        keyExtractor={item => item.id}
        renderItem={renderItem}
      />
      <BottomBar /> {/* 하단 바 컴포넌트 사용 */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  addButton: {
    backgroundColor: '#00C77F',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
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
  eventAmount: {
    fontSize: 14,
    color: '#333',
  },
});

export default EventPage;
