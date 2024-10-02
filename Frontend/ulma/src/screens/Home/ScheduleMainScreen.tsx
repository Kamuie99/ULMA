import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '@/constants';

const ScheduleMainScreen = ({ navigation }) => {
  const [selectedDate, setSelectedDate] = useState('');

  const upcomingEvents = [
    { name: '결혼식', date: '2024-12-05', expectedExpense: '₩300,000', status: '미지급' },
    { name: '생일', date: '2024-11-20', expectedExpense: '₩100,000', status: '지급 완료' },
    { name: '생일', date: '2024-11-25', expectedExpense: '₩200,000', status: '미지급' },
    { name: '생일', date: '2024-11-25', expectedExpense: '₩200,000', status: '미지급' },
    { name: '생일', date: '2024-11-25', expectedExpense: '₩200,000', status: '미지급' },
    { name: '생일', date: '2024-11-25', expectedExpense: '₩200,000', status: '미지급' },
    { name: '생일', date: '2024-11-25', expectedExpense: '₩200,000', status: '미지급' },
    // Add more events if needed
  ];

  // Prepare marked dates for the calendar
  const markedDates = upcomingEvents.reduce((acc, event) => {
    acc[event.date] = { marked: true, dotColor: colors.GREEN_700 };
    return acc;
  }, {});

  // Filter events based on selected date
  const eventsForSelectedDate = upcomingEvents.filter(event => event.date === selectedDate);

  return (
    <View style={styles.container}>
      {/* Calendar */}
      <Calendar
        onDayPress={day => setSelectedDate(day.dateString)}
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
        // Set locale to Korean
        locale={'ko'}
      />

      {/* Upcoming Events */}
      <View style={styles.upcomingContainer}>
        <Text style={styles.sectionTitle}>다가오는 경조사</Text>
        <FlatList
          data={eventsForSelectedDate}
          keyExtractor={(item, index) => index.toString()}
          ListEmptyComponent={<Text style={styles.noEventsText}>해당 날짜에 경조사가 없습니다.</Text>}
          renderItem={({ item }) => (
            <View style={styles.eventCard}>
              <Text style={styles.eventName}>{item.name}</Text>
              <Text style={styles.eventDate}>{item.date}</Text>
              <Text style={styles.eventExpense}>예상 금액: {item.expectedExpense}</Text>
              <Text style={styles.eventStatus}>상태: {item.status}</Text>
            </View>
          )}
          style={styles.eventList}
          contentContainerStyle={styles.eventListContent}
        />
      </View>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('AddEvent')}>
        <Icon name="add-outline" size={28} color={colors.WHITE} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
  upcomingContainer: {
    flex: 1, // Allows this section to take up the remaining space
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
    color: colors.BLACK,
  },
  eventStatus: {
    fontSize: 14,
    color: colors.PINK,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: colors.GREEN_700,
    padding: 15,
    borderRadius: 30,
    elevation: 3,
  },
  noEventsText: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 16,
    color: colors.GRAY_700,
  },
  eventList: {
    flexGrow: 0, // Prevents FlatList from growing infinitely
  },
  eventListContent: {
    paddingBottom: 20, // Provides space at the bottom for scroll
  },
});

export default ScheduleMainScreen;
