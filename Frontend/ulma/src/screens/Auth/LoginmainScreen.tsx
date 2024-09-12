//색상, 디자인은 나중에 확인하고 수정하기
import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

const SignupScreen: React.FC = () => {
  const handlePress = (platform: string): void => {
    console.log(`${platform}로 시작하기 버튼을 눌렀습니다.`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>반가워요!</Text>
      <Text style={styles.description}>
        나만의 경조사비 관리 비서 <Text style={styles.highlight}>ULMA</Text>{' '}
        입니다.
      </Text>
      <Text style={styles.instruction}>시작 방법을 선택해주세요.</Text>

      <TouchableOpacity
        style={[styles.button, styles.kakaoButton]}
        onPress={() => handlePress('카카오톡')}>
        <Text style={styles.buttonText}>카카오톡으로 시작하기</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.naverButton]}
        onPress={() => handlePress('네이버')}>
        <Text style={styles.buttonText}>네이버로 시작하기</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.googleButton]}
        onPress={() => handlePress('구글')}>
        <Text style={styles.buttonText}>구글로 시작하기</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>또는</Text>

      <TouchableOpacity
        style={[styles.button, styles.emailButton]}
        onPress={() => handlePress('이메일')}>
        <Text style={styles.buttonText}>이메일로 시작하기</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handlePress('로그인')}>
        <Text style={styles.loginText}>
          혹시 계정이 있으신가요? 로그인 하러 가기
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  highlight: {
    color: '#00C77F', // ULMA 강조 색상
    fontWeight: 'bold',
  },
  instruction: {
    fontSize: 14,
    color: '#888',
    marginBottom: 16,
  },
  button: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginVertical: 8,
  },
  kakaoButton: {
    backgroundColor: '#FEE500',
  },
  naverButton: {
    backgroundColor: '#03C75A',
  },
  googleButton: {
    borderColor: '#4285F4',
    borderWidth: 1,
  },
  emailButton: {
    backgroundColor: '#00C77F',
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
  },
  orText: {
    fontSize: 14,
    color: '#888',
    marginVertical: 12,
  },
  loginText: {
    fontSize: 14,
    color: '#888',
    marginTop: 16,
  },
});

export default SignupScreen;
