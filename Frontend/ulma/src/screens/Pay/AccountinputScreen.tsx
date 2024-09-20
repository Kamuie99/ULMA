import React, {useState} from 'react';
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

const BankOptions = ['국민은행', '신한은행', '하나은행', '우리은행'];

const PayTransferScreen: React.FC = () => {
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
      <View style={styles.header}>
        <TouchableOpacity>
          <Text style={styles.backArrow}>{'<'}</Text> {/* 뒤로가기 버튼 */}
        </TouchableOpacity>
        <Text style={styles.headerText}>Pay 송금하기</Text>
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>보낼 계좌를 입력해주세요.</Text>

        {/* 은행 선택 */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>은행</Text>
          <TouchableOpacity style={styles.inputBox} onPress={toggleModal}>
            <Text style={styles.inputText}>
              {selectedBank ? selectedBank : '은행 선택'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* 계좌번호 입력 */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>계좌번호</Text>
          <TextInput
            style={styles.inputBox}
            value={accountNumber}
            onChangeText={setAccountNumber}
            keyboardType="numeric" // 숫자 키보드
            placeholder="계좌번호 입력"
            maxLength={14}
          />
        </View>

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

      {/* 송금하기 버튼 */}
      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.saveButtonText}>송금하기</Text>
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
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontFamily: 'SamsungGothicCondensed',
    fontWeight: '400',
    color: 'black',
    marginBottom: 10,
  },
  inputBox: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  inputText: {
    fontSize: 16,
    fontFamily: 'SamsungGothicCondensed',
    fontWeight: '400',
    color: 'black',
  },
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
    borderBottomColor: '#ddd',
  },
  modalText: {
    fontSize: 16,
    fontFamily: 'SamsungGothicCondensed',
    fontWeight: '400',
    color: 'black',
  },
  modalClose: {
    marginTop: 20,
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: 14,
    color: '#3FC89E',
  },
  saveButton: {
    backgroundColor: '#3FC89E',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 30,
  },
  saveButtonText: {
    fontSize: 14,
    fontFamily: 'SamsungGothicCondensed',
    fontWeight: '400',
    color: 'white',
  },
});

export default PayTransferScreen;
