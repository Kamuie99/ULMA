import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  Button,
  TextInput,
  StyleSheet,
  Alert,
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

interface CalendarComponentProps {
  selectedDate: string | null;
  onDateSelected: (date: string) => void;
}

const CalendarComponent: React.FC<CalendarComponentProps> = ({
  selectedDate,
  onDateSelected,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isYearSelection, setIsYearSelection] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [localSelectedDate, setLocalSelectedDate] = useState<string | null>(
    selectedDate,
  ); // 내부에서 날짜를 관리하기 위한 상태
  const [timeInput, setTimeInput] = useState(''); // 시간 입력 필드 상태

  // 사용자에게 보여줄 형식
  const formattedDate = localSelectedDate
    ? format(new Date(localSelectedDate), 'yyyy년 M월 d일', {
        locale: ko,
      })
    : '';

  // 시간 입력 시 "시", "분" 자동 추가
  const handleTimeChange = (text: string) => {
    const cleaned = text.replace(/\D/g, ''); // 숫자만 남김
    let formatted = cleaned;

    if (cleaned.length > 2) {
      formatted = cleaned.slice(0, 2) + '시 ' + cleaned.slice(2, 4) + '분';
    } else if (cleaned.length > 0) {
      formatted = cleaned.slice(0, 2) + '시';
    }

    setTimeInput(formatted);
  };

  // 저장 시 ISO 형식으로 변환
  const handleSave = () => {
    if (!localSelectedDate || !timeInput) {
      Alert.alert('경고', '날짜와 시간을 입력하세요.');
      return;
    }

    const selectedDateTime = new Date(localSelectedDate);
    const hours = parseInt(timeInput.slice(0, 2), 10);
    const minutes = parseInt(timeInput.slice(4, 6), 10);
    selectedDateTime.setHours(hours);
    selectedDateTime.setMinutes(minutes);
    selectedDateTime.setSeconds(0); // 초는 항상 00초로 설정

    onDateSelected(selectedDateTime.toISOString());
  };

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
      {/* 연도 및 월 선택 버튼 */}
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

      {/* 달력 */}
      <Calendar
        onDayPress={(day: DayPressEvent) => {
          setLocalSelectedDate(day.dateString); // 선택한 날짜 설정
        }}
        markedDates={{
          [localSelectedDate || '']: {
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

      {/* 시간 입력 필드 */}
      <TextInput
        style={styles.timeInput}
        placeholder="예) 14시 30분"
        value={timeInput}
        onChangeText={handleTimeChange}
        keyboardType="numeric"
      />

      {/* 저장 버튼 */}
      <Button title="저장" onPress={handleSave} />

      {/* 연도/월 선택 모달 */}
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
  timeInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
});

export default CalendarComponent;
