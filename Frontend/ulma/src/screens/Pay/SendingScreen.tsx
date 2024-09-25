//송금금액 입력 페이지
import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const SendingScreen: React.FC = () => {
  const [amount, setAmount] = useState<string>('100000');
  const navigation = useNavigation();

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      {/* 상단 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>{'<'}</Text> {/* 뒤로가기 버튼 */}
        </TouchableOpacity>
        <Text style={styles.headerText}>Pay 송금하기</Text>
      </View>

      {/* 금액 입력 및 추천 버튼 */}
      <View style={styles.contentContainer}>
        <Text style={styles.title}>보낼 금액을 입력해주세요.</Text>

        {/* 금액 입력 박스 */}
        <View style={styles.amountContainer}>
          <TextInput
            style={styles.amountInput}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            placeholder="0"
            maxLength={10}
          />
          <Text style={styles.currencyText}>원</Text>
        </View>

        {/* 추천 액수 받기 섹션 */}
        <TouchableOpacity style={styles.recommendationBox}>
          <View>
            <Text style={styles.subText}>얼마 보낼지 애매한가요?</Text>
            <Text style={styles.mainText}>송금 액수 추천 받기</Text>
          </View>
          <View style={styles.recommendIcon}>
            <Text>🤖</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* 저장 버튼 */}
      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.saveButtonText}>저장</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

// 스타일 정의
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 20,
  },
  backArrow: {
    fontSize: 18,
    marginRight: 10,
    color: 'black',
  },
  headerText: {
    fontSize: 14,
    fontFamily: 'Inter',
    fontWeight: '700',
    color: 'black',
  },
  contentContainer: {
    backgroundColor: '#F7F8FA',
    borderRadius: 10,
    padding: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 22,
    fontFamily: 'SamsungGothicCondensed',
    fontWeight: '400',
    color: 'black',
    marginBottom: 20,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#3FC89E',
    paddingBottom: 10,
    marginBottom: 20,
  },
  amountInput: {
    flex: 1,
    fontSize: 18,
    fontFamily: 'SamsungGothicCondensed',
    fontWeight: '400',
    color: 'black',
    textAlign: 'right',
  },
  currencyText: {
    fontSize: 18,
    fontFamily: 'SamsungGothicCondensed',
    fontWeight: '400',
    color: '#A7A7A7',
    marginLeft: 10,
  },
  recommendationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  subText: {
    fontSize: 12,
    fontFamily: 'SamsungGothicCondensed',
    fontWeight: '400',
    color: '#A7A7A7',
  },
  mainText: {
    fontSize: 12,
    fontFamily: 'SamsungGothicCondensed',
    fontWeight: '400',
    color: 'black',
    marginTop: 5,
  },
  recommendIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginLeft: 10,
  },
  saveButton: {
    backgroundColor: '#C2EADF',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 30,
  },
  saveButtonText: {
    fontSize: 14,
    fontFamily: 'SamsungGothicCondensed',
    fontWeight: '400',
    color: '#3FC89E',
  },
});

export default SendingScreen;
