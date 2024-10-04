import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import Icon from 'react-native-vector-icons/Ionicons';
import axiosInstance from '@/api/axios';
import { colors } from '@/constants';
import { Swipeable } from 'react-native-gesture-handler';
import { useFocusEffect } from '@react-navigation/native';

const ScheduleMainScreen = ({ navigation }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [currentMonth, setCurrentMonth] = useState({ year: 2024, month: 10 });

  const fetchEvents = async (year, month) => {
    try {
      const response = await axiosInstance.get(`/schedule`, {
        params: { year, month },
      });
      setUpcomingEvents(response.data);
    } catch (error) {
      console.error('스케줄 데이터를 가져오는데 실패했습니다:', error);
    }
  };

  useEffect(() => {
    fetchEvents(currentMonth.year, currentMonth.month);
  }, [currentMonth]);

  // 화면 포커스 시 데이터 다시 불러오기
  useFocusEffect(
    useCallback(() => {
      fetchEvents(currentMonth.year, currentMonth.month);
    }, [currentMonth])
  );

  const markedDates = upcomingEvents.reduce((acc, event) => {
    const date = event.date.split('T')[0];
    acc[date] = { marked: true, dotColor: colors.GREEN_700 };
    return acc;
  }, {});

  const eventsForSelectedDate = upcomingEvents.filter(event => event.date.startsWith(selectedDate));

  const deleteEvent = async (scheduleId) => {
    try {
      await axiosInstance.delete(`/schedule/${scheduleId}`);
      setUpcomingEvents(prevEvents => prevEvents.filter(event => event.scheduleId !== scheduleId));
      Alert.alert('삭제 완료', '경조사가 삭제되었습니다.');
    } catch (error) {
      console.error('스케줄 삭제에 실패했습니다:', error);
      Alert.alert('삭제 실패', '경조사 삭제에 실패했습니다.');
    }
  };

  const confirmDelete = (scheduleId) => {
    Alert.alert(
      "삭제 확인",
      "이 경조사를 삭제하시겠습니까?",
      [
        {
          text: "아니오",
          style: "cancel"
        },
        {
          text: "예",
          onPress: () => deleteEvent(scheduleId)
        }
      ],
      { cancelable: true }
    );
  };

  const renderRightActions = (scheduleId) => {
    return (
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => confirmDelete(scheduleId)}
      >
        <Icon name="trash-outline" size={28} color={colors.RED} />
      </TouchableOpacity>
    );
  };

  const renderEventCard = ({ item }) => (
    <Swipeable
      renderRightActions={() => renderRightActions(item.scheduleId)}
    >
      <View style={styles.eventCard}>
        <View style={styles.eventCardInner}>
          <Text style={styles.eventName}>{item.name}</Text>
          <Text>{item.category}</Text>
        </View>
        <Text style={styles.eventDate}>{item.date.split('T')[0]}</Text>
        <View style={styles.eventCardInner}>
          <Text style={styles.eventExpense}>₩ {-item.paidAmount}</Text>
          <Text>{item.guestName}님과의 거래내역 조회 -></Text>
        </View>
      </View>
    </Swipeable>
  );

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={day => setSelectedDate(day.dateString)}
        onMonthChange={month => setCurrentMonth({ year: month.year, month: month.month })}
        markedDates={{
          ...markedDates,
          [selectedDate]: {
            selected: true,
            marked: !!markedDates[selectedDate],
            selectedColor: colors.GREEN_700,
          },
        }}
        monthFormat={'yyyy년 MM월'}
        theme={{
          selectedDayBackgroundColor: colors.GREEN_700,
          arrowColor: colors.GREEN_700,
        }}
        locale={'ko'}
      />

      <View style={styles.upcomingContainer}>
        <Text style={styles.sectionTitle}>다가오는 경조사</Text>
        <FlatList
          data={eventsForSelectedDate}
          keyExtractor={(item) => item.scheduleId.toString()}
          ListEmptyComponent={<Text style={styles.noEventsText}>해당 날짜에 경조사가 없습니다.</Text>}
          renderItem={renderEventCard}
          style={styles.eventList}
          contentContainerStyle={styles.eventListContent}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
  upcomingContainer: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  eventCard: {
    backgroundColor: colors.WHITE,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  eventName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  eventDate: {
    fontSize: 14,
    color: colors.GRAY_700,
  },
  eventExpense: {
    fontSize: 14,
    color: colors.PINK,
  },
  deleteButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
  },
  noEventsText: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 16,
    color: colors.GRAY_700,
  },
  eventList: {
    flexGrow: 0,
  },
  eventListContent: {
    paddingBottom: 20,
  },
  eventCardInner: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
});

export default ScheduleMainScreen;
