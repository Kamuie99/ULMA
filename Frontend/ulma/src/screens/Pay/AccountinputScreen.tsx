import CustomButton from '@/components/common/CustomButton';
import TitleTextField from '@/components/common/TitleTextField';
import {colors} from '@/constants';
import {payNavigations} from '@/constants/navigations';
import {payStackParamList} from '@/navigations/stack/PayStackNavigator';
import {useFocusEffect} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  KeyboardAvoidingView,
} from 'react-native';

const BankOptions = ['', '국민은행', '신한은행', '하나은행', '우리은행'];

type AccountInputScreenProps = StackScreenProps<
  payStackParamList,
  typeof payNavigations.ACCOUNT_INPUT
>;

const AccountinputScreen = ({navigation}: AccountInputScreenProps) => {
  useFocusEffect(
    useCallback(() => {
      navigation.getParent()?.setOptions({
        tabBarStyle: undefined,
      });
      return;
    }, [navigation]),
  );
  const [selectedBank, setSelectedBank] = useState<string>(''); // 선택된 은행
  const [accountNumber, setAccountNumber] = useState<string>(''); // 계좌번호 입력값
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false); // 모달 가시성

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handleBankSelection = (bank: string) => {
    setSelectedBank(bank); // 선택된 은행 설정
    toggleModal(); // 모달 닫기
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      {/* 상단 헤더 */}
      <View style={styles.contentContainer}>
        <TitleTextField frontLabel="보낼 계좌를 입력해주세요." />

        {/* 입력 */}
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.inputBox} onPress={toggleModal}>
            {selectedBank ? (
              <Text style={styles.bankText}>{selectedBank}</Text>
            ) : (
              <Text style={styles.inputText}>은행</Text>
            )}
          </TouchableOpacity>
          <TextInput
            style={styles.inputBox}
            value={accountNumber}
            onChangeText={setAccountNumber}
            keyboardType="numeric" // 숫자 키보드
            placeholder="계좌번호"
            placeholderTextColor={colors.GRAY_700}
            maxLength={14}
          />
        </View>
        <CustomButton
          label="송금하기"
          onPress={() => navigation.navigate(payNavigations.SEND_RESULT)}
        />

        {/* 은행 선택 모달 */}
        <Modal
          visible={isModalVisible}
          transparent={true}
          animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <FlatList
                data={BankOptions}
                keyExtractor={item => item}
                renderItem={({item}) => (
                  <TouchableOpacity
                    style={styles.modalOption}
                    onPress={() => handleBankSelection(item)}>
                    <Text style={styles.modalText}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity style={styles.modalClose} onPress={toggleModal}>
                <Text style={styles.modalCloseText}>닫기</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </KeyboardAvoidingView>
  );
};

// 스타일 정의
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
    padding: 20,
  },
  contentContainer: {
    backgroundColor: colors.LIGHTGRAY,
    borderRadius: 10,
    flex: 1,
  },
  inputContainer: {
    flex: 1,
    gap: 10,
  },
  inputBox: {
    backgroundColor: colors.WHITE,
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.GRAY_300,
    width: '90%',
    height: 50,
    marginLeft: 10,
    fontSize: 16,
    justifyContent: 'center',
  },
  inputText: {
    fontWeight: '400',
    fontSize: 16,
    color: colors.GRAY_700,
  },
  bankText: {
    color: colors.BLACK,
    fontWeight: '400',
    fontSize: 16,
  },
  // modal
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    margin: 20,
    padding: 20,
  },
  modalOption: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.GRAY_300,
  },
  modalText: {
    fontSize: 16,
    fontWeight: '400',
    color: 'black',
  },
  modalClose: {
    marginTop: 20,
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: 14,
    color: colors.GREEN_700,
  },
});

export default AccountinputScreen;
