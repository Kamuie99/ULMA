import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack'; // StackScreenProps를 사용하여 navigation 및 route 타입을 가져옴
import {eventStackParamList} from '@/navigations/stack/EventStackNavigator';
import axiosInstance from '@/api/axios';

// 타입 정의: navigation과 route에 대한 타입
type Props = StackScreenProps<eventStackParamList, 'EVENT_FIX'>;

const EventFixScreen = ({navigation, route}: Props) => {
  const {eventId} = route.params;
  const [category, setCategory] = useState('');
  const [name, setName] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await axiosInstance.get(`/events/${eventId}`);
        const {category, name, eventTime} = response.data;
        setCategory(category);
        setName(name);
        setDate(eventTime);
      } catch (error) {
        console.error(
          '이벤트 데이터를 불러오는 중 오류가 발생했습니다:',
          error,
        );
      }
    };

    fetchEventData();
  }, [eventId]);

  const handleSave = async () => {
    try {
      await axiosInstance.patch(`/events/${eventId}`, {
        category,
        name,
        date,
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
      <TextInput
        style={styles.input}
        value={category}
        onChangeText={setCategory}
        placeholder="카테고리를 입력하세요"
      />

      <Text style={styles.label}>이벤트 이름</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="이벤트 이름을 입력하세요"
      />

      <Text style={styles.label}>이벤트 날짜</Text>
      <TextInput
        style={styles.input}
        value={date}
        onChangeText={setDate}
        placeholder="이벤트 날짜를 입력하세요 (YYYY-MM-DD)"
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
