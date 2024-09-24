import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useAuthStore from '@/store/useAuthStore';

function SignupScreen2() {
  const { signupData, setSignupData } = useAuthStore();
  const [errors, setErrors] = useState({ loginId: '', password: '', passwordConfirm: '', email: '' });

  const handleInputChange = (field: keyof typeof signupData, value: string) => {
    setSignupData({ [field]: value });
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validateInputs = () => {
    let isValid = true;
    const newErrors = { ...errors };

    if (!signupData.loginId) {
      newErrors.loginId = '아이디를 입력해주세요.';
      isValid = false;
    }

    if (!signupData.password) {
      newErrors.password = '비밀번호를 입력해주세요.';
      isValid = false;
    }

    if (signupData.password !== signupData.passwordConfirm) {
      newErrors.passwordConfirm = '비밀번호가 일치하지 않습니다.';
      isValid = false;
    }

    if (!signupData.email) {
      newErrors.email = '이메일을 입력해주세요.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSignup = () => {
    if (validateInputs()) {
      // Implement signup logic here
      console.log('Signup data:', signupData);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>회원가입 (2/2)</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>아이디</Text>
          <TextInput
            placeholder="아이디를 입력하세요"
            value={signupData.loginId}
            onChangeText={(text) => handleInputChange('loginId', text)}
            style={styles.input}
          />
          {errors.loginId ? <Text style={styles.errorText}>{errors.loginId}</Text> : null}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>비밀번호</Text>
          <TextInput
            placeholder="비밀번호를 입력하세요"
            value={signupData.password}
            onChangeText={(text) => handleInputChange('password', text)}
            style={styles.input}
            secureTextEntry
          />
          {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>비밀번호 확인</Text>
          <TextInput
            placeholder="비밀번호를 다시 입력하세요"
            value={signupData.passwordConfirm}
            onChangeText={(text) => handleInputChange('passwordConfirm', text)}
            style={styles.input}
            secureTextEntry
          />
          {errors.passwordConfirm ? <Text style={styles.errorText}>{errors.passwordConfirm}</Text> : null}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>이메일</Text>
          <TextInput
            placeholder="이메일을 입력하세요"
            value={signupData.email}
            onChangeText={(text) => handleInputChange('email', text)}
            style={styles.input}
            keyboardType="email-address"
          />
          {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
        </View>

        <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
          <Text style={styles.signupButtonText}>회원가입 완료</Text>
        </TouchableOpacity>
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
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
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