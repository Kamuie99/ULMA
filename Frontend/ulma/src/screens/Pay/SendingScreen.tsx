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
import {
  NavigationProp,
  RouteProp,
  useNavigation,
} from '@react-navigation/native';
import {payNavigations} from '@/constants/navigations';
import {payStackParamList} from '@/navigations/stack/PayStackNavigator';
import Toast from 'react-native-toast-message';
import axiosInstance from '@/api/axios';
import useAuthStore from '@/store/useAuthStore';

interface SendingScreenProps {
  route: RouteProp<payStackParamList, typeof payNavigations.SENDING>;
}

function SendingScreen({route}: SendingScreenProps) {
  const navigation = useNavigation<NavigationProp<payStackParamList>>();

  // 전달받은 targetAccountNumber 값을 route에서 가져옴
  const {targetAccountNumber} = route.params;

  useEffect(() => {
    // 페이지에 들어올 때 탭바 숨기기
    navigation.getParent()?.setOptions({
      tabBarStyle: {display: 'none'},
    });
  }, [navigation]);
  const [amount, setAmount] = useState<string>('');

  const handleSendMoney = async () => {
    const {accessToken} = useAuthStore.getState(); // accessToken 가져오기
    console.log(targetAccountNumber);
    if (!amount || !targetAccountNumber) {
      Toast.show({
        text1: '모든 정보를 입력하세요.',
        type: 'error',
      });
      return;
    }

    try {
      const response = await axiosInstance.post(
        '/users/pay/send',
        {
          info: '결혼식',
          targetAccountNumber: targetAccountNumber, // 수신 계좌 번호
          amount: parseInt(amount, 10), // 송금 금액 (정수로 변환)
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Authorization 헤더에 토큰 추가
          },
        },
      );

      console.log('송금 성공:', response.data);
      // 송금 성공 후 다음 화면으로 이동 또는 성공 메시지 표시
      navigation.navigate(payNavigations.SEND_RESULT);
    } catch (error) {
      console.error('송금 중 오류 발생:', error);
    }
  };

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
        <TouchableOpacity
          style={styles.recommendationBox}
          onPress={() => navigation.navigate(payNavigations.RECOMMEND_OPTION)}>
          <Image source={require('@/assets/Pay/RecommBtn.png')} />
        </TouchableOpacity>

        <CustomButton label="송금하기" onPress={handleSendMoney} />
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
