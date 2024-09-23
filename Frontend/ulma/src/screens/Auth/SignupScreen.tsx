import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, Text, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface SignupScreenProps {}

function SignupScreen({}: SignupScreenProps) {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [idLastDigit, setIdLastDigit] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerificationCode, setShowVerificationCode] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [resendText, setResendText] = useState('인증번호 전송');

  const fadeAnim = {
    birthDate: useState(new Animated.Value(0))[0],
    phoneNumber: useState(new Animated.Value(0))[0],
    verificationCode: useState(new Animated.Value(0))[0],
    signup: useState(new Animated.Value(0))[0],
  };

  const fadeIn = (animatedValue: Animated.Value) => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    if (name) fadeIn(fadeAnim.birthDate);
  }, [name]);

  useEffect(() => {
    if (birthDate && idLastDigit) fadeIn(fadeAnim.phoneNumber);
  }, [birthDate, idLastDigit]);

  useEffect(() => {
    if (isVerified) fadeIn(fadeAnim.signup);
  }, [isVerified]);

  const formatPhoneNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{0,4})(\d{0,4})$/);
    if (match) {
      return !match[2] ? match[1] : `${match[1]}-${match[2]}${match[3] ? `-${match[3]}` : ''}`;
    }
    return text;
  };

  const handlePhoneNumberChange = (text: string) => {
    setPhoneNumber(formatPhoneNumber(text));
  };

  const handleSendVerification = () => {
    setShowVerificationCode(true);
    setResendText('재전송');
    fadeIn(fadeAnim.verificationCode);
  };

  const handleNumberInput = (text: string, setter: React.Dispatch<React.SetStateAction<string>>) => {
    const numberOnly = text.replace(/[^0-9]/g, '');
    setter(numberOnly);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* <Text style={styles.title}>휴대폰 본인 확인</Text> */}
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>이름</Text>
          <TextInput
            placeholder="홍길동"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
        </View>

        <Animated.View style={[styles.inputContainer, { opacity: fadeAnim.birthDate }]}>
          <Text style={styles.label}>주민등록번호</Text>
          <View style={styles.row}>
            <TextInput
              placeholder="생년월일 (6자리)"
              value={birthDate}
              onChangeText={(text) => handleNumberInput(text, setBirthDate)}
              style={[styles.input, styles.birthInput]}
              keyboardType="numeric"
              maxLength={6}
            />
            <Text style={styles.dash}>-</Text>
            <TextInput
              placeholder="뒷자리"
              value={idLastDigit}
              onChangeText={(text) => handleNumberInput(text, setIdLastDigit)}
              style={[styles.input, styles.idInput]}
              keyboardType="numeric"
              maxLength={1}
            />
            <Text>*******</Text>
          </View>
        </Animated.View>

        <Animated.View style={[styles.inputContainer, { opacity: fadeAnim.phoneNumber }]}>
          <Text style={styles.label}>휴대폰번호</Text>
          <View style={styles.row}>
            <TextInput
              placeholder="010-0000-0000"
              value={phoneNumber}
              onChangeText={handlePhoneNumberChange}
              style={[styles.input, styles.phoneInput]}
              keyboardType="phone-pad"
            />
            <TouchableOpacity style={styles.button} onPress={handleSendVerification}>
              <Text style={styles.buttonText}>{resendText}</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {showVerificationCode && (
          <Animated.View style={[styles.inputContainer, { opacity: fadeAnim.verificationCode }]}>
            <Text style={styles.label}>인증번호</Text>
            <View style={styles.row}>
              <TextInput
                placeholder="인증번호 6자리 입력"
                value={verificationCode}
                onChangeText={(text) => handleNumberInput(text, setVerificationCode)}
                style={[styles.input, styles.codeInput]}
                keyboardType="numeric"
                maxLength={6}
              />
              <TouchableOpacity style={styles.button} onPress={() => setIsVerified(true)}>
                <Text style={styles.buttonText}>확인</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}

        {isVerified && (
          <Animated.View style={{ opacity: fadeAnim.signup }}>
            <TouchableOpacity style={styles.signupButton} onPress={() => {}}>
              <Text style={styles.signupButtonText}>회원가입</Text>
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
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  birthInput: {
    flex: 3,
  },
  idInput: {
    flex: 1,
    marginLeft: 10,
  },
  phoneInput: {
    flex: 1,
    marginRight: 10,
  },
  codeInput: {
    flex: 1,
    marginRight: 10,
  },
  dash: {
    marginHorizontal: 10,
    fontSize: 18,
    color: '#555',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
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

export default SignupScreen;