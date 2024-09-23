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
import {colors} from '@/constants';
import {useNavigation} from '@react-navigation/native';
import {eventNavigations} from '@/constants/navigations';
import {StackNavigationProp} from '@react-navigation/stack';
import TitleTextField from '@/components/common/TitleTextField';
import CustomButton from '@/components/common/CustomButton';
import InputField from '@/components/common/InputField';

type EventStackParamList = {
  [eventNavigations.EVENT_DATE]: undefined;
};

const EventAddScreen = () => {
  const navigation =
    useNavigation<StackNavigationProp<EventStackParamList, 'EventDate'>>();
  const [eventTitle, setEventTitle] = useState<string>('');
  const [selectedEventType, setSelectedEventType] = useState<string | null>(
    null,
  );

  const handleSaveEvent = () => {
    if (!eventTitle || !selectedEventType) {
      console.log('경고', '이벤트 제목과 유형을 입력하세요.');
      return;
    }

    // 이벤트 저장 처리 후 다음 화면으로 이동
    // console.log('성공', '이벤트가 저장되었습니다.');
    navigation.navigate(eventNavigations.EVENT_DATE, {
      eventTitle: eventTitle, // 전달할 이벤트 제목
    });
  };

  const eventTypes = ['결혼', '돌잔치', '장례식', '생일', '기타'];

  return (
    <View style={styles.container}>
      <TitleTextField frontLabel="어떤 경조사인가요?" />
      <InputField
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

      <CustomButton label="확인" variant="outlined" onPress={handleSaveEvent} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
});

export default EventAddScreen;
