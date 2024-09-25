import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, Text, TouchableOpacity, ScrollView, Animated, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axiosInstance from '@/api/axios'; // axiosInstance import
import useAuthStore from '@/store/useAuthStore';
import axios, { AxiosError } from 'axios';

function SignupScreen2() {
  const { signupData, setSignupData } = useAuthStore();
  const [errors, setErrors] = useState({ loginId: '', password: '', passwordConfirm: '', email: '' });
  const [isLoginIdEditable, setLoginIdEditable] = useState(true);  // 아이디 입력창 수정 가능 여부
  const [isDuplicateCheckDisabled, setDuplicateCheckDisabled] = useState(false);  // 중복체크 버튼 비활성화 여부
  const [passwordError, setPasswordError] = useState('');
  const [passwordConfirmError, setPasswordConfirmError] = useState('');
  const [isDuplicateChecked, setIsDuplicateChecked] = useState(false); // 중복 체크 완료 여부
  const [isEmailSent, setIsEmailSent] = useState(false);  // 이메일 인증 여부
  const [isSendingEmail, setIsSendingEmail] = useState(false); // 이메일 발송 중 여부
  const [emailVerificationCode, setEmailVerificationCode] = useState('');  // 인증번호 상태
  const [emailVerificationError, setEmailVerificationError] = useState('');  // 이메일 관련 오류 상태
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
    setSignupData({ [field]: value });
  };

  const isId = (asValue: string) => {
    const regExp = /^[a-z]+[a-z0-9]{5,19}$/g;
    return regExp.test(asValue);
  };

  const isPassword = (asValue: string) => {
    const regExp = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+]).{8,16}$/;
    return regExp.test(asValue); // 비밀번호 유효성 검사
  };

  const isEmail = (asValue: string) => {
    const regExp = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
    return regExp.test(asValue);
  };

  const handlePasswordChange = (text: string) => {
    setSignupData({ password: text });

    // 비밀번호 유효성 검사
    if (!isPassword(text)) {
      setPasswordError('8 ~ 16자 영문, 숫자, 특수문자를 최소 한가지씩 조합해주세요.');
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
    setSignupData({ passwordConfirm: text });

    // 비밀번호 확인 일치 여부 검사
    if (text !== signupData.password) {
      setPasswordConfirmError('비밀번호가 일치하지 않습니다.');
    } else {
      setPasswordConfirmError('');
    }
  };

  const handleDuplicateCheck = async () => {
    if (!isId(signupData.loginId)) {
      setErrors(prev => ({ ...prev, loginId: '영문자로 시작하는 영문자 또는 숫자 6~20자 아이디를 입력해주세요.' }));
      return;
    }

    try {
      const response = await axiosInstance.get('/auth/loginId', {
        params: { loginId: signupData.loginId },
      });

      if (response.status === 200) {
        Alert.alert(
          '아이디 중복 확인',
          '사용 가능한 아이디입니다. 이 아이디를 사용하시겠습니까?',
          [
            {
              text: '아니오',
              onPress: () => {
                setSignupData({ loginId: '' }); // 아이디 입력 초기화
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
          ]
        );
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response && axiosError.response.status === 409) {
        Alert.alert('중복된 아이디', '중복되는 아이디가 존재합니다.');
      } else {
        Alert.alert('중복체크 오류', '아이디 중복체크 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    }
  };

  const handleEmailVerification = async () => {
    if (!isEmail(signupData.email)) {
      setErrors(prev => ({ ...prev, email: '정확한 이메일 주소를 입력해주세요.' }));
      return;
    }

    setIsSendingEmail(true); // 로딩 시작

    try {
      const response = await axiosInstance.post('/auth/email', {
        email: signupData.email,
      });

      if (response.status === 200) {
        Alert.alert('이메일 인증', '인증 메일이 발송되었습니다. 인증번호를 입력해주세요.');
        setIsEmailSent(true);  // 이메일 인증번호 입력창을 띄우기 위한 상태 변경
        setEmailVerificationError('');
        setResendText('재전송'); // 버튼 텍스트를 재전송으로 변경
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response && axiosError.response.status === 409) {
        Alert.alert('중복된 이메일', '이미 사용중인 이메일입니다.');
      } else {
        Alert.alert('이메일 발송 오류', '이메일 발송 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsSendingEmail(false); // 로딩 종료
    }
  };

  const handleVerifyCode = async () => {
    setIsVerifyingCode(true); // 로딩 시작

    try {
      const response = await axiosInstance.put('/auth/email', {
        email: signupData.email,
        verificationCode: emailVerificationCode,
      });

      if (response.status === 200) {
        setIsEmailVerified(true); // 이메일 인증 완료
        setEmailVerificationError('');
        fadeIn(fadeAnimSignupButton); // 회원가입 버튼 보이기
        Alert.alert('인증 완료', '이메일 인증이 완료되었습니다.');
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response && axiosError.response.status === 400) {
        setEmailVerificationError('인증번호가 일치하지 않습니다.');
      } else {
        setEmailVerificationError('인증을 다시 시도해주세요.');
      }
    } finally {
      setIsVerifyingCode(false); // 로딩 종료
    }
  };

  const handleSignup = async () => {
    // 비밀번호 확인 에러가 있을 경우 회원가입 중단 
    if (passwordError || passwordConfirmError) {
      Alert.alert('오류', '비밀번호를 올바르게 입력해주세요.');
      return;
    }
    try {
      console.log({
        'name': signupData.name,
        'loginId': signupData.loginId,
        'password': signupData.password,
        'passwordConfirm': signupData.passwordConfirm,
        'email': signupData.email,
        'phoneNumber': signupData.phoneNumber,
        'birthDate': signupData.birthDate,
        genderDigit: signupData.genderDigit,
    })
      // 회원가입 API 호출
      const response = await axiosInstance.post('/auth/join', {
        name: signupData.name,
        loginId: signupData.loginId,
        password: signupData.password,
        passwordConfirm: signupData.passwordConfirm,
        email: signupData.email,
        phoneNumber: signupData.phoneNumber,
        birthDate: signupData.birthDate,
        genderDigit: signupData.genderDigit,
      });
      if (response.status === 200) {
        Alert.alert('회원가입 완료', '회원가입이 완료되었습니다. 로그인 헤주세요.');
        console.log('회원가입 완료');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<any>;
        if (axiosError.response) {
          switch (axiosError.response.status) {
            case 400:
              Alert.alert('입력 오류', '입력한 정보를 다시 확인해주세요.');
              break;
            case 409:
              Alert.alert('중복 오류', '이미 사용 중인 아이디 또는 이메일입니다.');
              break;
            case 422:
              Alert.alert('유효성 검사 실패', '입력한 데이터가 유효하지 않습니다.');
              break;
            case 500:
              Alert.alert('서버 오류', '서버에 문제가 발생했습니다. 나중에 다시 시도해주세요.');
              break;
            default:
              Alert.alert('오류', `알 수 없는 오류가 발생했습니다: ${axiosError.response.status}`);
          }
          console.error('Server response:', axiosError.response.data);
        } else if (axiosError.request) {
          Alert.alert('네트워크 오류', '서버에 연결할 수 없습니다. 인터넷 연결을 확인해주세요.');
        } else {
          Alert.alert('오류', '요청 설정 중 오류가 발생했습니다.');
        }
        console.error('Error message:', axiosError.message);
      } else {
        Alert.alert('오류', '알 수 없는 오류가 발생했습니다.');
        console.error('Unknown error:', error);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>회원가입 (2/2)</Text>

        {/* 아이디 입력 및 중복체크 */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>아이디</Text>
          <View style={styles.row}>
            <TextInput
              placeholder="사용할 아이디를 입력하세요"
              value={signupData.loginId}
              onChangeText={(text) => handleInputChange('loginId', text)} // handleInputChange 사용
              style={styles.input}
              editable={isLoginIdEditable}
            />
            <TouchableOpacity
              style={[styles.button, isDuplicateCheckDisabled && { backgroundColor: '#DDD' }]}
              onPress={handleDuplicateCheck}
              disabled={isDuplicateCheckDisabled}
            >
              <Text style={styles.buttonText}>중복체크</Text>
            </TouchableOpacity>
          </View>
          {errors.loginId ? <Text style={styles.errorText}>{errors.loginId}</Text> : null}
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
                editable={!isEmailVerified} // 이메일 인증 완료 후 수정 불가
              />
              {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>비밀번호 확인</Text>
              <TextInput
                placeholder="비밀번호를 다시 입력하세요"
                value={signupData.passwordConfirm}
                onChangeText={handlePasswordConfirmChange} // 비밀번호 확인 일치 여부 추가
                style={styles.input}
                secureTextEntry
                editable={!isEmailVerified} // 이메일 인증 완료 후 수정 불가
              />
              {passwordConfirmError ? <Text style={styles.errorText}>{passwordConfirmError}</Text> : null}
            </View>
          </>
        )}

        {/* 이메일 입력 */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>이메일</Text>
          {isEmailVerified ? (
            <TextInput
              placeholder="이메일을 입력하세요"
              value={signupData.email}
              style={styles.input}
              editable={false} // 이메일 인증 완료 후 수정 불가
            />
          ) : (
            <View style={styles.row}>
              <TextInput
                placeholder="이메일을 입력하세요"
                value={signupData.email}
                onChangeText={(text) => handleInputChange('email', text)} // handleInputChange 사용
                style={styles.input}
                keyboardType="email-address"
              />
              <TouchableOpacity
                style={[styles.button, isSendingEmail && { backgroundColor: '#DDD' }]}
                onPress={handleEmailVerification}
                disabled={isSendingEmail}
              >
                {isSendingEmail ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <Text style={styles.buttonText}>{resendText}</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
          {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
        </View>

        {/* 이메일 인증번호 입력 및 인증 */}
        {isEmailSent && !isEmailVerified && (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>인증번호</Text>
            <TextInput
              placeholder="8자리 인증번호를 입력하세요"
              value={emailVerificationCode}
              onChangeText={setEmailVerificationCode}
              style={styles.input}
              maxLength={8}
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={styles.button}
              onPress={handleVerifyCode}
              disabled={isVerifyingCode}
            >
              {isVerifyingCode ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <Text style={styles.buttonText}>인증하기</Text>
              )}
            </TouchableOpacity>
            {emailVerificationError ? (
              <Text style={styles.errorText}>{emailVerificationError}</Text>
            ) : null}
          </View>
        )}

        {/* 이메일 인증 완료 메시지 */}
        {isEmailVerified && (
          <Text style={styles.successText}>이메일 인증이 완료되었습니다.</Text>
        )}

        {/* 회원가입 버튼 */}
        {isEmailVerified && (
          <Animated.View style={{ opacity: fadeAnimSignupButton }}>
            <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
              <Text style={styles.signupButtonText}>회원가입 완료</Text>
            </TouchableOpacity>
          </Animated.View>
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
  successText: {
    color: 'green',
    fontSize: 14,
    marginTop: 5,
    fontWeight: 'bold',
  },
  signupButton: {
    backgroundColor: '#34C759',
    padding: 18,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  signupButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SignupScreen2;
