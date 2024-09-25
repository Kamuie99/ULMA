import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import axiosInstance from '@/api/axios'; // axiosInstance import
import useAuthStore from '@/store/useAuthStore';
import axios, { AxiosError } from 'axios';

function SignupScreen2() {
  const {signupData, setSignupData} = useAuthStore();
  const [errors, setErrors] = useState({
    loginId: '',
    password: '',
    passwordConfirm: '',
    email: '',
  });
  const [isLoginIdEditable, setLoginIdEditable] = useState(true); // 아이디 입력창 수정 가능 여부
  const [isDuplicateCheckDisabled, setDuplicateCheckDisabled] = useState(false); // 중복체크 버튼 비활성화 여부
  const [passwordError, setPasswordError] = useState('');
  const [passwordConfirmError, setPasswordConfirmError] = useState('');
  const [isDuplicateChecked, setIsDuplicateChecked] = useState(false); // 중복 체크 완료 여부
  const [isPasswordConfirmTyped, setIsPasswordConfirmTyped] = useState(false); // 비밀번호 확인 입력 여부
  const [isEmailSent, setIsEmailSent] = useState(false); // 이메일 인증 여부
  const [isSendingEmail, setIsSendingEmail] = useState(false); // 이메일 발송 중 여부
  const [emailVerificationCode, setEmailVerificationCode] = useState(''); // 인증번호 상태
  const [emailVerificationError, setEmailVerificationError] = useState(''); // 이메일 관련 오류 상태
  const [resendText, setResendText] = useState('인증메일 발송'); // 인증메일 발송 버튼 텍스트
  const [isEmailVerified, setIsEmailVerified] = useState(false); // 이메일 인증 완료 여부
  const [isVerifyingCode, setIsVerifyingCode] = useState(false); // 인증번호 확인 중 여부

  const fadeAnimSignupButton = useState(new Animated.Value(0))[0]; // 회원가입 버튼 애니메이션

  const fadeIn = (animatedValue: Animated.Value) => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // handleInputChange 함수 정의
  const handleInputChange = (field: keyof typeof signupData, value: string) => {
    setSignupData({[field]: value});
  };

  const isId = (asValue: string) => {
    const regExp = /^[a-z]+[a-z0-9]{5,19}$/g;
    return regExp.test(asValue);
  };

  const isPassword = (asValue: string) => {
    const regExp =
      /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+]).{8,16}$/;
    return regExp.test(asValue); // 비밀번호 유효성 검사
  };

  const isEmail = (asValue: string) => {
    const regExp =
      /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
    return regExp.test(asValue);
  };

  const handlePasswordChange = (text: string) => {
    setSignupData({password: text});

    // 비밀번호 유효성 검사
    if (!isPassword(text)) {
      setPasswordError(
        '8 ~ 16자 영문, 숫자, 특수문자를 최소 한가지씩 조합해주세요.',
      );
    } else {
      setPasswordError('');
    }

    // 비밀번호가 바뀌면 비밀번호 확인 초기화 및 에러 검사
    if (text !== signupData.passwordConfirm) {
      setPasswordConfirmError('비밀번호가 일치하지 않습니다.');
    } else {
      setPasswordConfirmError('');
    }
  };

  const handlePasswordConfirmChange = (text: string) => {
    setSignupData({passwordConfirm: text});

    // 비밀번호 확인 입력이 시작되었음을 표시
    if (text.length > 0) {
      setIsPasswordConfirmTyped(true);
    }

    // 비밀번호 확인 일치 여부 검사
    if (text !== signupData.password) {
      setPasswordConfirmError('비밀번호가 일치하지 않습니다.');
    } else {
      setPasswordConfirmError('');
    }
  };

  const handleDuplicateCheck = async () => {
    if (!isId(signupData.loginId)) {
      setErrors(prev => ({
        ...prev,
        loginId:
          '영문자로 시작하는 영문자 또는 숫자 6~20자 아이디를 입력해주세요.',
      }));
      return;
    }

    try {
      const response = await axiosInstance.get('/auth/loginId', {
        params: {loginId: signupData.loginId},
      });

      if (response.data === true) {  // 중복 된 경우
        Alert.alert('중복된 아이디', '중복되는 아이디가 존재합니다.');
      } else {
        Alert.alert(
          '아이디 중복 확인',
          '사용 가능한 ID입니다. 사용하시겠습니까?',
          [
            {
              text: '아니오',
              onPress: () => {
                setSignupData({loginId: ''}); // 아이디 입력 초기화
                setLoginIdEditable(true); // 다시 아이디 입력 가능하도록
              },
              style: 'cancel',
            },
            {
              text: '예',
              onPress: () => {
                setLoginIdEditable(false); // 아이디 수정 불가
                setDuplicateCheckDisabled(true); // 중복체크 버튼 비활성화
                setIsDuplicateChecked(true); // 중복 체크 완료
              },
            },
          ],
        );
      }
    } catch (error) {
        Alert.alert(
          '중복체크 오류',
          '아이디 중복체크 중 오류가 발생했습니다. 다시 시도해주세요.',
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>회원가입 (2/2)</Text>
        {/* 아이디 입력 및 중복체크 */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>ID</Text>
          <View style={styles.row}>
            <TextInput
              placeholder="사용할 ID를 입력하세요"
              value={signupData.loginId}
              onChangeText={text => handleInputChange('loginId', text)} // handleInputChange 사용
              style={styles.input}
              editable={isLoginIdEditable}
            />
            <TouchableOpacity
              style={[
                styles.button,
                isDuplicateCheckDisabled && {backgroundColor: '#DDD'},
              ]}
              onPress={handleDuplicateCheck}
              disabled={isDuplicateCheckDisabled}>
              <Text style={styles.buttonText}>중복체크</Text>
            </TouchableOpacity>
          </View>
          {errors.loginId ? (
            <Text style={styles.errorText}>{errors.loginId}</Text>
          ) : null}
        </View>

        {/* 비밀번호 입력 */}
        {isDuplicateChecked && (
          <>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>비밀번호</Text>
              <TextInput
                placeholder="비밀번호를 입력하세요"
                value={signupData.password}
                onChangeText={handlePasswordChange} // 비밀번호 유효성 검사 추가
                style={styles.input}
                secureTextEntry
              />
              {passwordError ? (
                <Text style={styles.errorText}>{passwordError}</Text>
              ) : null}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>비밀번호 확인</Text>
              <TextInput
                placeholder="비밀번호를 다시 입력하세요"
                value={signupData.passwordConfirm}
                onChangeText={handlePasswordConfirmChange} // 비밀번호 확인 일치 여부 추가
                style={styles.input}
                secureTextEntry
              />
              {passwordConfirmError ? (
                <Text style={styles.errorText}>{passwordConfirmError}</Text>
              ) : null}
            </View>
          </>
        )}

        {/* 이메일 입력 */}
        {isPasswordConfirmTyped && (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>이메일</Text>
            <View style={styles.row}>
              <TextInput
                placeholder="이메일을 입력하세요"
                value={signupData.email}
                onChangeText={text => handleInputChange('email', text)} // handleInputChange 사용
                style={styles.input}
                keyboardType="email-address"
              />
              <TouchableOpacity
                style={[
                  styles.button,
                  isSendingEmail && {backgroundColor: '#DDD'},
                ]}
                onPress={() => { /* 이메일 인증 처리 함수 추가 */ }}
                disabled={isSendingEmail}>
                {isSendingEmail ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <Text style={styles.buttonText}>인증메일 발송</Text>
                )}
              </TouchableOpacity>
            </View>
            {errors.email ? (
              <Text style={styles.errorText}>{errors.email}</Text>
            ) : null}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#555',
  },
  input: {
    height: 50,
    borderColor: '#DDD',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#FFF',
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
});

export default SignupScreen2;
