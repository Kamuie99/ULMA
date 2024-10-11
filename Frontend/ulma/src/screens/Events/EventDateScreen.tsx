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
import TitleTextField from '@/components/common/TitleTextField';
import CustomButton from '@/components/common/CustomButton';
import InputField from '@/components/common/InputField';
import Toast from 'react-native-toast-message';

const EventDateScreen = () => {
  const [date, setDate] = useState('');
  const route = useRoute();
  // const navigation = useNavigation();

  // 이전 페이지에서 입력받은 이벤트 제목
  const {eventTitle} = route.params as {eventTitle: string};

  // 확인 버튼을 눌렀을 때 호출되는 함수
  const handleSave = () => {
    if (!date) {
      Toast.show({
        text1: '날짜를 입력하세요.',
        type: 'error',
      });
      return;
    }
    // navigation.navigate('다음페이지'); // 다음 페이지로 이동-내비게이션나중에설정
  };
  ///
  return (
    <View style={styles.container}>
      <TitleTextField
        frontLabel=""
        emphMsg={eventTitle}
        backLabel="은 언제인가요?"
      />

      <InputField
        placeholder="년 - 월 - 일"
        value={date}
        onChangeText={setDate}
      />

      <CustomButton label="확인" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default EventDateScreen;
