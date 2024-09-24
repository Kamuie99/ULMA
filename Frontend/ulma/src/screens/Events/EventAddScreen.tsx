//이벤트(행사이름입력) 추가 페이지
import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import {NavigationProp} from '@react-navigation/native';
import BottomBar from '../../components/common/BottomBar'; // 하단 바 컴포넌트 경로에 맞게 수정

interface EventAddScreenProps {
  navigation: NavigationProp<any>;
}

const EventAddScreen: React.FC<EventAddScreenProps> = ({navigation}) => {
  const [eventTitle, setEventTitle] = useState<string>('');
  const [selectedEventType, setSelectedEventType] = useState<string | null>(
    null,
  );

  const handleSaveEvent = () => {
    if (!eventTitle || !selectedEventType) {
      Alert.alert('경고', '이벤트 제목과 유형을 입력하세요.');
      return;
    }

    // 이벤트 저장 처리 후 다음 화면으로 이동
    Alert.alert('성공', '이벤트가 저장되었습니다.');
    navigation.navigate('다음페이지'); // 여기에 다음 페이지의 경로를 추가하세요.
  };

  const eventTypes = ['결혼', '돌잔치', '장례식', '생일', '기타'];

  return (
    <View style={styles.container}>
      <Text style={styles.label}>어떤 경조사인가요?</Text>
      <TextInput
        style={styles.input}
        placeholder="이벤트 제목을 입력하세요"
        value={eventTitle}
        onChangeText={setEventTitle}
      />

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

      <TouchableOpacity style={styles.saveButton} onPress={handleSaveEvent}>
        <Text style={styles.saveButtonText}>확인</Text>
      </TouchableOpacity>

      {/* 하단 바 추가 */}
      <BottomBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    justifyContent: 'space-between', // 상단 내용과 하단 바 사이에 간격을 유지
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#00C77F',
    paddingVertical: 8,
    marginBottom: 16,
    fontSize: 16,
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
  saveButton: {
    backgroundColor: '#00C77F',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default EventAddScreen;
