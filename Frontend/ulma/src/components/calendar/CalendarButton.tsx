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
import DateTimePickerModal from 'react-native-modal-datetime-picker'; // 시간 선택을 위한 모달 라이브러리

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
  const [isTimePickerVisible, setTimePickerVisible] = useState(false); // 시간 선택 모달 상태
  const [selectedTime, setSelectedTime] = useState<Date | null>(null); // 선택된 시간
  const [localSelectedDate, setLocalSelectedDate] = useState<string | null>(
    selectedDate,
  ); // 내부에서 날짜를 관리하기 위한 상태

  // 사용자에게 보여줄 형식
  const formattedDate = localSelectedDate
    ? format(new Date(localSelectedDate), 'yyyy년 M월 d일 a h시 mm분', {
        locale: ko,
      })
    : '';

  // 시간 선택 모달에서 시간을 선택했을 때
  const handleTimeConfirm = (time: Date) => {
    setSelectedTime(time);
    setTimePickerVisible(false);

    // 날짜와 시간을 조합하여 최종 선택된 날짜/시간을 부모 컴포넌트로 전달
    if (localSelectedDate) {
      const selectedDateTime = new Date(localSelectedDate);
      selectedDateTime.setHours(time.getHours());
      selectedDateTime.setMinutes(time.getMinutes());

      onDateSelected(selectedDateTime.toISOString());
    }
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
          setTimePickerVisible(true); // 날짜 선택 후 시간 선택 모달 열기
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

      {/* 시간 선택 모달 */}
      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode="time" // 시간 선택 모드
        is24Hour={true} // 키보드 모드로 기본 설정
        locale="ko-KR" // 한글 표시
        onConfirm={handleTimeConfirm}
        onCancel={() => setTimePickerVisible(false)}
      />

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
});

export default CalendarComponent;
