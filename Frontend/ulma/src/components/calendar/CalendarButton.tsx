//일단 캘린더에서 달력 화면, 연도.월 모달로 선택기능, + 여기서 달력 디자인 커스텀 할 수 있게(디자인은 바꾸면 될 듯)
import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  Button,
  StyleSheet,
} from 'react-native';
import {Calendar} from 'react-native-calendars';
import {format} from 'date-fns';
import {ko} from 'date-fns/locale';

interface DayPressEvent {
  dateString: string;
  day: number;
  month: number;
  year: number;
}

const CalendarComponent: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isYearSelection, setIsYearSelection] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  const formattedDate = selectedDate
    ? format(new Date(selectedDate), 'PPP', {locale: ko})
    : '';

  const openModal = (yearSelection: boolean) => {
    setIsYearSelection(yearSelection);
    setModalVisible(true);
  };

  const handleYearSelect = (year: number) => {
    setSelectedYear(year);
    setModalVisible(false);
  };

  const handleMonthSelect = (month: number) => {
    setSelectedMonth(month);
    setModalVisible(false);
  };

  return (
    <View>
      <View style={styles.rowContainer}>
        <TouchableOpacity onPress={() => openModal(true)}>
          <Text style={styles.textStyle}>{selectedYear}년</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => openModal(false)}
          style={styles.buttonStyle}>
          <Text style={styles.textStyle}>{selectedMonth}월</Text>
        </TouchableOpacity>
      </View>

      <Calendar
        onDayPress={(day: DayPressEvent) => {
          setSelectedDate(day.dateString);
        }}
        markedDates={{
          [selectedDate || '']: {
            selected: true,
            marked: true,
            selectedColor: 'green',
          },
        }}
        theme={{
          backgroundColor: '#ffffff',
          calendarBackground: '#f5f5f5',
          textSectionTitleColor: '#b6c1cd',
          selectedDayBackgroundColor: '#00adf5',
          selectedDayTextColor: '#ffffff',
          todayTextColor: '#ff0000',
          dayTextColor: '#2d4150',
          arrowColor: 'orange',
          monthTextColor: 'blue',
        }}
      />
      <Text>선택된 날짜: {formattedDate}</Text>

      <Modal visible={modalVisible} transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={
                isYearSelection
                  ? Array.from({length: 101}, (_, i) => selectedYear - 50 + i)
                  : Array.from({length: 12}, (_, i) => i + 1)
              }
              keyExtractor={item => item.toString()}
              renderItem={({item}) => (
                <TouchableOpacity
                  onPress={() =>
                    isYearSelection
                      ? handleYearSelect(item as number)
                      : handleMonthSelect(item as number)
                  }
                  style={styles.listItem}>
                  <Text style={styles.listText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <Button title="닫기" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  textStyle: {
    fontSize: 18,
  },
  buttonStyle: {
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  listText: {
    fontSize: 18,
  },
});

export default CalendarComponent;
