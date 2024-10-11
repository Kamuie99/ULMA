import CustomButton from '@/components/common/CustomButton';
import React, {useRef, useState, useEffect} from 'react';
import {StyleSheet, TextInput, View} from 'react-native';

interface Props {
  verifyNumber: string;
}

function AccountVerifyScreen({verifyNumber}: Props) {
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const [code, setCode] = useState(Array(6).fill(''));
  useEffect(() => {
    if (verifyNumber) {
      const numberArray = verifyNumber.split('');
      const paddedArray = numberArray.concat(
        Array(6 - numberArray.length).fill(''),
      );
      setCode(paddedArray);
    }
  }, [verifyNumber]);

  const handleChangeText = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleSubmit = () => {
    const submitNumber = code.join('');
    if (verifyNumber === submitNumber) {
    }

    return (
      <View style={styles.container}>
        <View style={styles.smContainer}>
          <View style={styles.inputContainer}>
            {code.map((digit, index) => (
              <TextInput
                key={index}
                ref={ref => (inputRefs.current[index] = ref)} // 각 TextInput을 참조 배열에 저장
                value={digit}
                onChangeText={text => handleChangeText(text, index)}
                style={styles.input}
                keyboardType="number-pad"
                maxLength={1} // 한 글자만 입력 가능
                returnKeyType="next"
                autoFocus={index === 0} // 첫 번째 필드에 자동 포커스
              />
            ))}
          </View>
        </View>
        <CustomButton
          label="추가하기"
          variant="outlined"
          onPress={handleSubmit}
        />
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    smContainer: {
      flex: 1,
      justifyContent: 'center',
    },
    inputContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '80%',
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      width: 40,
      height: 50,
      textAlign: 'center',
      fontSize: 20,
      borderRadius: 5,
    },
  });
}

export default AccountVerifyScreen;
