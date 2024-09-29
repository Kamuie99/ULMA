import axiosInstance from '@/api/axios';
import CustomButton from '@/components/common/CustomButton';
import InputField from '@/components/common/InputField';
import TitleTextField from '@/components/common/TitleTextField';
import {colors} from '@/constants';
import {payNavigations} from '@/constants/navigations';
import {payStackParamList} from '@/navigations/stack/PayStackNavigator';
import useAuthStore from '@/store/useAuthStore';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';

type InputAmountScreenRouteProp = RouteProp<
  payStackParamList,
  typeof payNavigations.INPUT_AMOUNT // 'INPUT_AMOUNT' 대신 정확한 경로 이름 사용
>;

type InputAmountScreenProps = {
  route: InputAmountScreenRouteProp;
};

function InputAmountScreen({route}: InputAmountScreenProps) {
  const {guestId} = route.params; // route.params에서 guestId를 받아옴
  const {accessToken} = useAuthStore();
  const [amount, setAmount] = useState(0);

  async function handleOnPress(guestId: number) {
    try {
      const response = await axiosInstance.post('/participant/money', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          eventId: 16,
          guestId: guestId,
          amount: amount,
        },
      });
      console.log('response:', response);
    } catch (error) {
      console.log(guestId, amount);
      console.error('error:', error);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.cardContainer}>
        <View style={{paddingHorizontal: 10, gap: 40}}>
          <TitleTextField frontLabel="금액을 입력해주세요." />
          <InputField
            placeholder="금액"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />
        </View>

        <CustomButton
          label="목록에 추가하기"
          onPress={() => handleOnPress(guestId)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.LIGHTGRAY,
  },
  cardContainer: {
    flex: 1,
    backgroundColor: colors.WHITE,
    margin: 20,
    paddingTop: 40,
    borderRadius: 15,
    borderColor: colors.GRAY_300,
    borderWidth: 1,
    shadowColor: colors.BLACK,
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 4,
  },
});

export default InputAmountScreen;
