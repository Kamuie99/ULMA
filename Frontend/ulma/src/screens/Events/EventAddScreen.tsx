import React, {useState} from 'react';
import {View, TouchableOpacity, StyleSheet, Alert, Text} from 'react-native';
import TitleTextField from '@/components/common/TitleTextField';
import CustomButton from '@/components/common/CustomButton';
import axiosInstance from '@/api/axios';
import InputField from '@/components/common/InputField';
import {NavigationProp} from '@react-navigation/native';
import {eventNavigations} from '@/constants/navigations';
import CalendarComponent from '@/components/calendar/CalendarButton'; // CalendarComponent 추가
import {format} from 'date-fns'; // 날짜 형식 변환을 위한 라이브러리 추가
import {ko} from 'date-fns/locale'; // 한글 로케일

const EventAddScreen = ({navigation}: {navigation: NavigationProp<any>}) => {
  const [eventTitle, setEventTitle] = useState<string>(''); // 행사 제목
  const [selectedEventType, setSelectedEventType] = useState<string | null>(
    null,
  ); // 행사 유형
  const [eventDate, setEventDate] = useState<string>(''); // 행사 날짜 선택 (string 형태로 변경)
  const [calendarVisible, setCalendarVisible] = useState(false); // 달력 모달 상태

  // 행사 저장 처리 함수
  const handleSaveEvent = async () => {
    if (!eventTitle || !selectedEventType || !eventDate) {
      Alert.alert('경고', '이벤트 제목, 유형, 날짜를 모두 입력하세요.');
      return;
    }

    try {
      // ISO 형식으로 날짜 전송
      const response = await axiosInstance.post('/events', {
        category: selectedEventType,
        name: eventTitle,
        date: new Date(eventDate).toISOString(), // 날짜를 ISO 형식으로 변환하여 전송
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

  // 사용자에게 보여줄 때는 "년/월/일 오전/오후 시간 분" 형식으로 변환
  const formattedDate = eventDate
    ? format(new Date(eventDate), 'yyyy년 M월 d일 a h시 mm분', {locale: ko})
    : '';

  // 이벤트 유형 옵션
  const eventTypes = ['결혼', '돌잔치', '장례식', '생일', '기타'];

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
        {eventTypes.map(type => (
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

      {/* 달력 모달 열기 */}
      <TouchableOpacity
        onPress={() => setCalendarVisible(true)}
        style={styles.dateButton}>
        <Text style={styles.dateButtonText}>
          {formattedDate ? formattedDate : '날짜 및 시간 선택'}
        </Text>
      </TouchableOpacity>

      {/* CalendarComponent 모달 */}
      {calendarVisible && (
        <CalendarComponent
          selectedDate={eventDate}
          onDateSelected={date => {
            setEventDate(date); // 선택한 날짜 설정
            setCalendarVisible(false); // 모달 닫기
          }}
        />
      )}

      {/* 확인 버튼 */}
      <CustomButton label="확인" variant="outlined" onPress={handleSaveEvent} />
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
    marginBottom: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateButtonText: {
    color: '#00C77F',
  },
});

export default EventAddScreen;
