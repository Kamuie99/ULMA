import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {eventStackParamList} from '@/navigations/stack/EventStackNavigator';
import moment from 'moment';
import axiosInstance from '@/api/axios';

// 타입 정의: navigation과 route에 대한 타입
type Props = StackScreenProps<eventStackParamList, 'EVENT_FIX'>;

const EventFixScreen = ({navigation, route}: Props) => {
  const {event_id, category, name, eventTime} = route.params as {
    event_id: string;
    category: string;
    name: string;
    eventTime: string;
  };

  // 화면에 표시할 때는 category를 카테고리로, name을 이름으로 표시
  const [eventCategory, setEventCategory] = useState(category); // 카테고리에 category를 저장
  const [eventName, setEventName] = useState(name); // 이름에 name을 저장
  const [eventDate, setEventDate] = useState(
    moment(eventTime).format('YYYY-MM-DD'),
  );
  const [eventTimeValue, setEventTimeValue] = useState(
    moment(eventTime).format('HH:mm'),
  );

  // 저장할 때만 category와 name을 바꿔서 보냄
  const handleSave = async () => {
    try {
      // 입력한 날짜와 시간으로 ISO 형식으로 변환 (초는 00초로 고정)
      const formattedDate = moment(
        `${eventDate} ${eventTimeValue}`,
        'YYYY-MM-DD HH:mm',
      )
        .set({second: 0, millisecond: 0})
        .toISOString();

      // 저장할 때는 category와 name을 바꿔서 백엔드로 전송
      await axiosInstance.patch(`/events/${event_id}`, {
        category: eventName, // 이름을 category로 전송
        name: eventCategory, // 카테고리를 name으로 전송
        date: formattedDate, // ISO 형식으로 변환된 날짜/시간 전송
      });

      Alert.alert('성공', '이벤트가 성공적으로 수정되었습니다.');
      navigation.goBack();
    } catch (error) {
      console.error('이벤트 수정 중 오류가 발생했습니다:', error);
      Alert.alert('오류', '이벤트 수정 중 오류가 발생했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>이벤트 카테고리</Text>
      {/* 이벤트 이름으로 name 표시 */}
      <TextInput
        style={styles.input}
        value={eventName} // name을 eventName으로 표시
        onChangeText={setEventName}
        placeholder="이벤트 이름을 입력하세요"
      />
      <Text style={styles.label}>이벤트 이름</Text>
      {/* 이벤트 카테고리로 category 표시 */}
      <TextInput
        style={styles.input}
        value={eventCategory} // category를 eventCategory로 표시
        onChangeText={setEventCategory}
        placeholder="카테고리를 입력하세요"
      />

      <Text style={styles.label}>이벤트 날짜</Text>
      <TextInput
        style={styles.input}
        value={eventDate}
        onChangeText={setEventDate}
        placeholder="이벤트 날짜를 입력하세요 (YYYY-MM-DD)"
      />

      <Text style={styles.label}>이벤트 시간</Text>
      <TextInput
        style={styles.input}
        value={eventTimeValue}
        onChangeText={setEventTimeValue}
        placeholder="이벤트 시간을 입력하세요 (HH:mm)"
      />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>저장</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#00C77F',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default EventFixScreen;
