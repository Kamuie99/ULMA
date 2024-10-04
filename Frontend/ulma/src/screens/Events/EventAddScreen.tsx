import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import TitleTextField from '@/components/common/TitleTextField';
import CustomButton from '@/components/common/CustomButton';
import axiosInstance from '@/api/axios';
import {NavigationProp} from '@react-navigation/native';
import {eventNavigations} from '@/constants/navigations';
import CalendarComponent from '@/components/calendar/CalendarButton';
import {format} from 'date-fns';
import {ko} from 'date-fns/locale';
import InputField from '@/components/common/InputField';
import {ScrollView} from 'react-native-gesture-handler';

const EventAddScreen = ({navigation}: {navigation: NavigationProp<any>}) => {
  const [eventTitle, setEventTitle] = useState<string>(''); // 행사 제목
  const [selectedEventType, setSelectedEventType] = useState<string | null>(
    null,
  ); // 행사 유형
  const [eventDate, setEventDate] = useState<string>(''); // 행사 날짜 및 시간
  const [calendarVisible, setCalendarVisible] = useState(false); // 달력 모달 상태
  const [isConfirmVisible, setConfirmVisible] = useState(true); // 확인 버튼 상태

  // 이벤트 저장 처리 함수
  const handleSaveEvent = async () => {
    if (!eventTitle || !selectedEventType || !eventDate) {
      Alert.alert('경고', '이벤트 제목, 유형, 날짜를 모두 입력하세요.');
      return;
    }

    try {
      const response = await axiosInstance.post('/events', {
        category: selectedEventType,
        name: eventTitle,
        date: eventDate, // 이미 ISO 형식으로 변환된 날짜 전송
      });

      console.log('성공:', response.data);
      Alert.alert('성공', '이벤트가 저장되었습니다.');

      // 이벤트 저장 후 이벤트 목록 화면으로 이동
      navigation.navigate(eventNavigations.EVENT);
    } catch (error) {
      console.error('API 요청 오류:', error);
      Alert.alert('에러', '이벤트 저장 중 오류가 발생했습니다.');
    }
  };

  // 사용자에게 보여줄 때는 "년/월/일" 형식으로 변환
  const formattedDate = eventDate
    ? format(new Date(eventDate), 'yyyy년 M월 d일 HH:mm', {locale: ko})
    : '';

  return (
    <View style={styles.container}>
      <TitleTextField frontLabel="어떤 경조사인가요?" />

      {/* 이벤트 제목 입력 */}
      <InputField
        placeholder="이벤트 제목을 입력하세요"
        value={eventTitle}
        onChangeText={setEventTitle}
      />

      {/* 이벤트 유형 선택 */}
      <View style={styles.buttonContainer}>
        {['결혼', '돌잔치', '장례식', '생일', '기타'].map(type => (
          <TouchableOpacity
            key={type}
            style={[
              styles.button,
              selectedEventType === type ? styles.selectedButton : null,
            ]}
            onPress={() => setSelectedEventType(type)}>
            <Text
              style={
                selectedEventType === type
                  ? styles.selectedButtonText
                  : styles.buttonText
              }>
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <ScrollView>
        {/* 달력 모달 열기 */}
        <TouchableOpacity
          onPress={() => {
            setCalendarVisible(true);
            setConfirmVisible(false); // 달력이 열리면 확인 버튼 숨기기
          }}
          style={styles.dateButton}>
          <Text style={styles.dateButtonText}>
            {formattedDate ? formattedDate : '날짜 선택'}
          </Text>
        </TouchableOpacity>

        {/* CalendarComponent 모달 */}
        {calendarVisible && (
          <CalendarComponent
            selectedDate={eventDate}
            onDateSelected={date => {
              setEventDate(date); // ISO 형식으로 전달받은 값을 저장
              setCalendarVisible(false);
              setConfirmVisible(true); // 날짜 선택 후 확인 버튼 다시 나타내기
            }}
          />
        )}
      </ScrollView>

      {/* 확인 버튼 - 달력이 열려 있을 때 숨김 */}
      {isConfirmVisible && (
        <CustomButton
          label="저장"
          variant="outlined"
          onPress={handleSaveEvent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#00C77F',
  },
  selectedButton: {
    backgroundColor: '#00C77F',
  },
  buttonText: {
    color: '#00C77F',
  },
  selectedButtonText: {
    color: '#fff',
  },
  dateButton: {
    padding: 16,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#00C77F',
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateButtonText: {
    color: '#00C77F',
  },
});

export default EventAddScreen;
