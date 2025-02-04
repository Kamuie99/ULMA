import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import Icon from 'react-native-vector-icons/Ionicons';
import axiosInstance from '@/api/axios';
import { colors } from '@/constants';
import { Swipeable } from 'react-native-gesture-handler';
import { useFocusEffect } from '@react-navigation/native';
import { friendsNavigations } from '@/constants/navigations';

const ScheduleMainScreen = ({ navigation }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [currentMonth, setCurrentMonth] = useState({ year: 2024, month: 10 });
  const [editingId, setEditingId] = useState(null); // 수정 중인 이벤트 ID
  const [editedAmount, setEditedAmount] = useState(''); // 수정된 금액

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

  const eventsForSelectedDate = selectedDate
    ? upcomingEvents.filter(event => event.date.startsWith(selectedDate))
    : upcomingEvents;

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

  const handleEditAmount = (scheduleId, paidAmount) => {
    setEditingId(scheduleId);
    setEditedAmount(Math.abs(paidAmount).toString()); // 음수 부호를 제거한 값으로 수정
  };

  const saveEditedAmount = async (scheduleId) => {
    if (editingId && editedAmount !== '') {
      try {
        const updatedAmount = -parseInt(editedAmount.replace(/,/g, ''), 10); // 음수로 변환하여 요청
        await axiosInstance.patch(`/schedule`, {
          scheduleId,
          paidAmount: updatedAmount,
        });
        setUpcomingEvents(prevEvents => prevEvents.map(event => {
          if (event.scheduleId === scheduleId) {
            return { ...event, paidAmount: updatedAmount };
          }
          return event;
        }));
        setEditingId(null); // 수정 완료 후 초기화
        setEditedAmount('');
        Alert.alert('수정 완료', '금액이 수정되었습니다.');
      } catch (error) {
        console.error('금액 수정에 실패했습니다:', error);
        Alert.alert('수정 실패', '금액 수정에 실패했습니다.');
      }
    }
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

  const getCategoryColor = (category) => {
    switch (category) {
      case '가족':
        return colors.PINK;
      case '친척':
        return colors.PINK;
      case '친구':
        return colors.GREEN_700;
      case '직장':
        return colors.PASTEL_BLUE;
      case '지인':
        return colors.PASTEL_BLUE;
      case '기타':
        return colors.GRAY_300;
      case '학교':
        return colors.PURPLE;
      default:
        return '#e0e0e0';
    }
  };

  const getCategoryTextColor = (category) => {
    switch (category) {
      case '가족':
      case '친구':
      case '직장':
        return colors.WHITE;
      default:
        return '#333';
    }
  };

  // 금액 세자리마다 쉼표 추가 함수
  const formatAmount = (amount) => {
    return new Intl.NumberFormat().format(amount);
  };

  const renderEventCard = ({ item }) => (
    <Swipeable
      renderRightActions={() => renderRightActions(item.scheduleId)}
    >
      <View style={styles.eventCard}>
        <View style={styles.eventCardInner}>
          <Text style={styles.eventName} ellipsizeMode="tail"  numberOfLines={2}>{item.name}</Text>
          <TouchableOpacity
            style={[styles.categoryButton, { backgroundColor: getCategoryColor(item.category) }]}
          >
            <Text style={[styles.categoryText, { color: getCategoryTextColor(item.category) }]}>
              {item.category}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.eventDate}>{item.date.split('T')[0]}</Text>

        <View style={styles.eventCardInner}>
          {editingId === item.scheduleId ? (
            <>
              <TextInput
                value={editedAmount}
                onChangeText={setEditedAmount}
                keyboardType="numeric"
                style={styles.editAmountInput}
              />
              <TouchableOpacity onPress={() => saveEditedAmount(item.scheduleId)}>
                <Text style={styles.saveButton}>수정</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity onPress={() => handleEditAmount(item.scheduleId, item.paidAmount)}>
                <Text style={styles.eventExpense}>₩ {formatAmount(Math.abs(item.paidAmount))}</Text>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity
            style={styles.transactionButton}
            onPress={() => navigation.navigate(friendsNavigations.FREINDS_DETAIL, {
              guestId: item.guestId,
              name: item.guestName,
              category: item.category,
              phoneNumber: item.phoneNumber,
            })}
          >
            <Text style={styles.transactionText}>거래내역 조회</Text>
            <Icon style={styles.toright} name="chevron-forward-outline" size={16} color={colors.GRAY_700} />
          </TouchableOpacity>
        </View>
      </View>
    </Swipeable>
  );

  const formatDateToKorean = (dateString) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}월 ${day}일`;
  };

  const handleDayPress = (day) => {
    if (selectedDate === day.dateString) {
      setSelectedDate('');
    } else {
      setSelectedDate(day.dateString);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          <Calendar
            onDayPress={handleDayPress}
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
              textDayFontSize: 16,
              textMonthFontSize: 16,
              textDayHeaderFontSize: 14,
              textSaturday: { color: 'blue' },
              textSunday: { color: 'red' },
              'stylesheet.calendar.header': {
                dayTextAtIndex0: { color: colors.PINK },
                dayTextAtIndex6: { color: colors.PASTEL_BLUE },
              },
            }}
            locale={'ko'}
          />

          <View style={styles.upcomingContainer}>
            <Text style={styles.sectionTitle}>
              {selectedDate
                ? `${formatDateToKorean(selectedDate)} 경조사`
                : `${currentMonth.month}월 전체 경조사`}
            </Text>
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
      </ScrollView>
    </KeyboardAvoidingView>
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
    fontSize: 17,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 20,
  },
  eventDate: {
    fontSize: 14,
    color: colors.GRAY_700,
    textAlign: 'right', // 날짜를 오른쪽 정렬
    marginTop: 5,
  },
  eventExpense: {
    fontSize: 18, // 금액 글씨 크기 키움
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
  categoryButton: {
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 14,
  },
  transactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionText: {
    fontSize: 14,
    color: colors.GRAY_700,
    // marginRight: 5,
  },
  toright: {
    marginTop: 3,
    alignItems: 'center',
  },
  editAmountInput: {
    borderBottomWidth: 1,
    borderColor: colors.GRAY_300,
    fontSize: 18,
    paddingHorizontal: 8,
  },
  saveButton: {
    fontSize: 16,
    color: colors.GREEN_700,
    marginTop: 10,
  },
});

export default ScheduleMainScreen;
