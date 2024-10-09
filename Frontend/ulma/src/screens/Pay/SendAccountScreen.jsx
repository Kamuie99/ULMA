import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Modal,
  FlatList,
} from 'react-native';
import TitleTextField from '@/components/common/TitleTextField';
import {colors} from '@/constants';
import CustomButton from '@/components/common/CustomButton';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {payNavigations} from '@/constants/navigations';
import {payStackParamList} from '@/navigations/stack/PayStackNavigator';
import Toast from 'react-native-toast-message';
import {banks} from '@/constants/banks';
import Icon from 'react-native-vector-icons/Entypo';
import axiosInstance from '@/api/axios';

function SendAccountScreen() {
  const navigation = useNavigation();
  const [targetAccountNumber, setTargetAccountNumber] = useState('');
  const [selectedBank, setSelectedBank] = useState(''); // 선택된 은행
  const [isModalVisible, setModalVisible] = useState(false); // 모달 가시성

  // 은행 목록
  const banks = [
    {id: '1', name: 'KB국민은행'},
    {id: '2', name: '신한은행'},
    {id: '3', name: '우리은행'},
    {id: '4', name: '하나은행'},
    {id: '5', name: '카카오뱅크'},
  ];

  // 은행 선택 핸들러
  const selectBank = bankName => {
    setSelectedBank(bankName);
    setModalVisible(false);
  };

  const handlePress = async () => {
    if (!selectedBank) {
      // 선택된 은행이 없을 때 에러 메시지 표시
      Toast.show({
        text1: '은행이 선택되지 않았습니다!',
        type: 'error',
      });
      return;
    }

    if (!targetAccountNumber) {
      // 계좌번호가 없을 때 에러 메시지 표시
      Toast.show({
        text1: '계좌 번호를 입력해주세요!',
        type: 'error',
      });
      return;
    }

    try {
      const response = await axiosInstance.post(
        '/users/account/target-verify',
        {
          bank: selectedBank,
          accountNumber: targetAccountNumber,
        },
      );

      if (response.status === 200) {
        // 성공적으로 요청이 완료되면 화면 이동
        navigation.navigate(payNavigations.SENDING, {
          targetAccountNumber: targetAccountNumber,
          selectedBank: selectedBank,
        });
      }
    } catch (error) {
      console.error('에러 발생:', error);
      Toast.show({
        text1: '계좌번호를 확인해주세요.',
        type: 'error',
      });
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      {/* 금액 입력 및 추천 버튼 */}
      <View style={styles.contentContainer}>
        <View style={{marginLeft: 20}}>
          <TitleTextField frontLabel="계좌번호를 입력해주세요" />
        </View>

        {/* 은행 선택 버튼 */}
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={styles.bankSelectButton}>
          <Text style={{color: selectedBank ? colors.BLACK : 'gray'}}>
            {selectedBank ? selectedBank : '은행 선택'}
          </Text>
          {!selectedBank ? (
            <Icon
              name="chevron-down"
              size={24}
              color={colors.GRAY_700}
              onPress={() => setSelectedBank('')}
            />
          ) : null}
        </TouchableOpacity>

        {/* 계좌번호 입력 박스 */}
        <View style={styles.amountContainer}>
          <TextInput
            style={styles.amountInput}
            value={targetAccountNumber}
            onChangeText={setTargetAccountNumber}
            placeholder="계좌번호 입력"
          />
        </View>
      </View>
      <CustomButton
        label="확인"
        variant="outlined"
        onPress={handlePress}
        size="large"
        posY={30}
      />

      {/* 은행 선택 모달 */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <TouchableOpacity
          style={styles.modalContainer}
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>은행 선택</Text>
            <FlatList
              data={banks}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.flatListContainer}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.bankItem}
                  onPress={() => selectBank(item.name)}>
                  <Text style={styles.bankName}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
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
  bankSelectButton: {
    paddingVertical: 15,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderColor: colors.GREEN_700,
    borderRadius: 5,
    marginBottom: 15,
    justifyContent: 'space-between',
    marginTop: 30,
    marginHorizontal: 20,
    flexDirection: 'row',
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
    fontWeight: '400',
    color: 'black',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    maxHeight: '60%',
    backgroundColor: colors.WHITE,
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  bankItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.GRAY_300,
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 50,
  },
});

export default SendAccountScreen;
