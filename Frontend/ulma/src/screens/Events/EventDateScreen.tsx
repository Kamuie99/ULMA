//이벤트 추가하기(행사 일자 추가)
import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';

const EventDateScreen = () => {
  const [date, setDate] = useState('');
  const route = useRoute();
  // const navigation = useNavigation();

  // 이전 페이지에서 입력받은 이벤트 제목
  const {eventTitle} = route.params as {eventTitle: string};

  // 확인 버튼을 눌렀을 때 호출되는 함수
  const handleSave = () => {
    if (!date) {
      Alert.alert('날짜를 입력하세요.');
      return;
    }
    // navigation.navigate('다음페이지'); // 다음 페이지로 이동-내비게이션나중에설정
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{eventTitle}은 언제인가요?</Text>

      <TextInput
        style={styles.input}
        placeholder="년 - 월 - 일"
        placeholderTextColor="#BDBDBD"
        value={date}
        onChangeText={setDate}
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>저장</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'space-between', // 상단 내용과 하단 바 사이 간격 유지
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#00C77F',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#00C77F',
    marginBottom: 30,
    fontSize: 16,
    paddingVertical: 5,
    color: '#000', // 텍스트 색상
  },
  saveButton: {
    backgroundColor: '#00C77F',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EventDateScreen;
