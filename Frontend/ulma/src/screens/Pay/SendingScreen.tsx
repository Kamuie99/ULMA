//송금금액 입력 페이지
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Image,
} from 'react-native';
import TitleTextField from '@/components/common/TitleTextField';
import {colors} from '@/constants';
import CustomButton from '@/components/common/CustomButton';
import {useNavigation} from '@react-navigation/native';

function SendingScreen({navigation}) {
  useEffect(() => {
    // 페이지에 들어올 때 탭바 숨기기
    navigation.getParent()?.setOptions({
      tabBarStyle: {display: 'none'},
    });
  }, [navigation]);
  const [amount, setAmount] = useState<string>('');

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      {/* 금액 입력 및 추천 버튼 */}
      <View style={styles.contentContainer}>
        <TitleTextField frontLabel="금액을 입력해주세요" />

        {/* 금액 입력 박스 */}
        <View style={styles.amountContainer}>
          <TextInput
            style={styles.amountInput}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            placeholder="0"
          />
          <Text style={styles.currencyText}>원</Text>
        </View>

        {/* 추천 액수 받기 섹션 */}
        <TouchableOpacity style={styles.recommendationBox}>
          <Image source={require('@/assets/Pay/RecommBtn.png')} />
        </TouchableOpacity>
        <CustomButton label="확인" variant="outlined" />
      </View>
    </KeyboardAvoidingView>
  );
}

// 스타일 정의
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  contentContainer: {
    backgroundColor: colors.LIGHTGRAY,
    borderRadius: 10,
    paddingTop: 50,
    flex: 1,
    marginVertical: 10,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.GREEN_700,
    marginTop: 25,
    marginHorizontal: 20,
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
    fontWeight: '400',
    color: colors.GRAY_700,
    marginLeft: 10,
  },
  recommendationBox: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginTop: 15,
    shadowColor: colors.BLACK,
    shadowOpacity: 0.1,
    elevation: 3,
    marginHorizontal: 20,
  },
});

export default SendingScreen;
