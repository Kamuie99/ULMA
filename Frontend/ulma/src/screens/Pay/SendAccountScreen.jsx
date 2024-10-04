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
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {payNavigations} from '@/constants/navigations';
import {payStackParamList} from '@/navigations/stack/PayStackNavigator';

function SendAccountScreen() {
  // useNavigation에 제네릭 타입을 추가해 navigation 타입을 명시적으로 지정
  // const navigation = useNavigation<NavigationProp<payStackParamList>>();
  const navigation = useNavigation();
  const [targetAccountNumber, setTargetAccountNumber] = useState('');

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      {/* 금액 입력 및 추천 버튼 */}
      <View style={styles.contentContainer}>
        <TitleTextField frontLabel="계좌번호를 입력해주세요" />

        {/* 금액 입력 박스 */}
        <View style={styles.amountContainer}>
          <TextInput
            style={styles.amountInput}
            value={targetAccountNumber}
            onChangeText={setTargetAccountNumber}
            placeholder="계좌번호"
          />
        </View>
        <CustomButton
          label="확인"
          variant="outlined"
          onPress={() =>
            navigation.navigate(payNavigations.SENDING, {
              targetAccountNumber: targetAccountNumber,
            })
          }
        />
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

export default SendAccountScreen;
