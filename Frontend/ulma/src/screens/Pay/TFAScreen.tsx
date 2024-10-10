import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import {useNavigation} from '@react-navigation/native'; // navigation 사용
import {colors} from '@/constants'; // colors 상수는 본인의 프로젝트에 맞게 설정
import {payNavigations} from '@/constants/navigations'; // 실제 사용중인 navigation 경로 설정
import axiosInstance from '@/api/axios';

const {width: deviceWidth} = Dimensions.get('window');

function TFAScreen() {
  const navigation = useNavigation();
  const [password, setPassword] = useState(['', '', '', '']); // 4자리 배열로 관리

  // 4자리 입력 완료 시 자동으로 axios 호출
  useEffect(() => {
    if (password.every(val => val !== '')) {
      const pin = password.join('');
      console.log('2차 비밀번호:', pin);

      // axios 요청
      axiosInstance
        .post('') // 실제 API 주소로 변경해야 함
        .then(response => {
          console.log('성공:', response.data);
          navigation.navigate(payNavigations.ACCOUNT_INFO);
        })
        .catch(error => {
          console.error('오류 발생:', error);
          Toast.show({
            type: 'error',
            text1: '비밀번호를 확인해주세요.',
          });
        });
    }
  }, [password]);

  const handleKeyPress = digit => {
    const newPass = [...password];
    const emptyIndex = newPass.findIndex(val => val === '');
    if (emptyIndex !== -1) {
      newPass[emptyIndex] = digit;
      setPassword(newPass);
    }
  };

  const handleDelete = () => {
    const newPass = [...password];
    const filledIndex = newPass.findLastIndex(val => val !== '');
    if (filledIndex !== -1) {
      newPass[filledIndex] = '';
      setPassword(newPass);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}></Text>

      {/* 한 자리씩 입력되는 4개의 입력 박스, 입력된 숫자는 *로 표시 */}
      <View style={styles.inputContainer}>
        {password.map((val, index) => (
          <View key={index} style={styles.inputBox}>
            <Text style={styles.inputText}>{val ? '•' : ''}</Text>
          </View>
        ))}
      </View>

      {/* 숫자 키패드 */}
      <View style={styles.wrapKeypad}>
        <View style={styles.keypad}>
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '←'].map(
            key => (
              <TouchableOpacity
                key={key}
                style={styles.key}
                onPress={() => {
                  if (key === '←') handleDelete();
                  else if (key !== '') handleKeyPress(key);
                }}>
                <Text style={styles.keyText}>{key}</Text>
              </TouchableOpacity>
            ),
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.WHITE,
  },
  label: {
    fontSize: 18,
    marginBottom: 20,
    color: colors.BLACK,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  inputBox: {
    width: 50,
    height: 50,
    borderColor: colors.GRAY_700,
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  inputText: {
    fontSize: 30,
    color: colors.BLACK,
  },
  wrapKeypad: {
    width: deviceWidth,
    position: 'absolute',
    bottom: 0,
  },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  key: {
    width: '30%',
    justifyContent: 'center',
    padding: 20,
    alignItems: 'center',
    backgroundColor: colors.LIGHTGRAY,
  },
  keyText: {
    fontSize: 24,
    color: colors.BLACK,
  },
});

export default TFAScreen;
