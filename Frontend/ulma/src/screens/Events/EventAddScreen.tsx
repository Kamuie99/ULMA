import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Switch,
} from 'react-native';
import {Picker} from '@react-native-picker/picker'; // Picker 컴포넌트 import
import TitleTextField from '@/components/common/TitleTextField';
import CustomButton from '@/components/common/CustomButton';
import axiosInstance from '@/api/axios';
import {NavigationProp} from '@react-navigation/native';
import {eventNavigations} from '@/constants/navigations';
import {format} from 'date-fns';
import {ko} from 'date-fns/locale';
import InputField from '@/components/common/InputField';
import {Calendar} from 'react-native-calendars';
import EventTag from '@/components/common/EventTag';
import Toast from 'react-native-toast-message';
import {colors} from '@/constants';

const EventAddScreen = ({navigation}: {navigation: NavigationProp<any>}) => {
  const [eventTitle, setEventTitle] = useState<string>(''); // 행사 제목
  const [selectedEventType, setSelectedEventType] = useState<string>('결혼'); // 행사 유형
  const [eventDate, setEventDate] = useState<string>(''); // 행사 날짜
  const [eventTime, setEventTime] = useState<{hour: string; minute: string}>({
    hour: '12',
    minute: '00',
  }); // 행사 시간
  const [isAllDay, setIsAllDay] = useState(false); // 종일 여부
  const [isConfirmVisible, setConfirmVisible] = useState(true); // 확인 버튼 상태

  // 종일 옵션 변경 함수
  const toggleAllDay = () => setIsAllDay(previousState => !previousState);

  // 이벤트 저장 처리 함수
  const handleSaveEvent = async () => {
    if (!eventTitle) {
      Toast.show({
        text1: '이벤트 제목을 입력하세요.',
        type: 'error',
      });
      return;
    }
    if (!selectedEventType) {
      Toast.show({
        text1: '이벤트 유형을 입력하세요.',
        type: 'error',
      });
      return;
    }
    if (!eventDate) {
      Toast.show({
        text1: '이벤트 날짜를 입력하세요.',
        type: 'error',
      });
      return;
    }

    const fullEventDate = isAllDay
      ? `${eventDate}T03:33:33` // 종일일 경우 03시 33분 33초로 설정
      : `${eventDate}T${eventTime.hour}:${eventTime.minute}:00`; // 선택한 시간과 분, 초는 00으로 고정

    try {
      const response = await axiosInstance.post('/events', {
        category: selectedEventType,
        name: eventTitle,
        date: fullEventDate,
      });

      console.log('성공:', response.data);
      Toast.show({
        text1: '이벤트가 추가 되었습니다.',
        type: 'success',
      });

      // 이벤트 저장 후 이벤트 목록 화면으로 이동
      navigation.navigate(eventNavigations.EVENT);
    } catch (error) {
      console.error('API 요청 오류:', error);
      Alert.alert('에러', '이벤트 저장 중 오류가 발생했습니다.');
    }
  };

  // 사용자에게 보여줄 때는 "년/월/일" 형식으로 변환
  const formattedDate = eventDate
    ? format(new Date(eventDate), 'yyyy년 M월 d일', {locale: ko})
    : '';

  return (
    <View style={styles.container}>
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
            onPress={() => setSelectedEventType(type)}
            style={{
              opacity: selectedEventType === type ? 1.0 : 0.3, // 선택된 이벤트 유형이면 opacity를 1.0으로
            }}>
            <EventTag label={type} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Calendar 컴포넌트 추가 */}
      <Calendar
        onDayPress={day => {
          setEventDate(day.dateString); // 날짜 선택 시 eventDate 업데이트
          setConfirmVisible(true); // 날짜 선택 후 확인 버튼 다시 나타내기
        }}
        markedDates={{
          [eventDate]: {
            selected: true,
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

      {/* 종일 옵션 */}
      <View style={styles.allDayContainer}>
        <Text>종일</Text>
        <Switch onValueChange={toggleAllDay} value={isAllDay} />
      </View>

      {/* 시간 선택 - 종일이 아닐 때만 표시 */}
      {!isAllDay && (
        <View style={styles.timePickerContainer}>
          <Text>시간 선택</Text>
          <View style={styles.pickerRow}>
            <Picker
              selectedValue={eventTime.hour}
              style={styles.picker}
              onValueChange={itemValue =>
                setEventTime(prevState => ({...prevState, hour: itemValue}))
              }>
              {Array.from({length: 24}, (_, i) => (
                <Picker.Item
                  key={i}
                  label={i.toString()}
                  value={i.toString().padStart(2, '0')}
                />
              ))}
            </Picker>
            <Text>:</Text>
            <Picker
              selectedValue={eventTime.minute}
              style={styles.picker}
              onValueChange={itemValue =>
                setEventTime(prevState => ({...prevState, minute: itemValue}))
              }>
              {Array.from({length: 60}, (_, i) => (
                <Picker.Item
                  key={i}
                  label={i.toString()}
                  value={i.toString().padStart(2, '0')}
                />
              ))}
            </Picker>
          </View>
        </View>
      )}

      {/* 확인 버튼 */}
      {isConfirmVisible && (
        <CustomButton label="저장" size="full" onPress={handleSaveEvent} />
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
    // justifyContent: 'space-between',
    gap: 10,
    marginBottom: 24,
    marginTop: 10,
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
  allDayContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  timePickerContainer: {
    marginVertical: 10,
  },
  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  picker: {
    height: 50,
    width: 100,
  },
});

export default EventAddScreen;
