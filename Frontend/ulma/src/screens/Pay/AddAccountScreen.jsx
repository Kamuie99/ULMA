import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Modal,
  Text,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import CustomButton from '@/components/common/CustomButton';
import InputField from '@/components/common/InputField';

function AddAccountScreen() {
  const [account, setAccount] = useState('');
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

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.bankSelectButton}>
        <Text>{selectedBank ? selectedBank : '은행 선택'}</Text>
      </TouchableOpacity>

      <InputField
        value={account}
        placeholder="계좌 번호를 입력하세요"
        onChangeText={setAccount}
        keyboardType="numeric"
      />
      <CustomButton label="추가하기" size="maxSize" />

      {/* 은행 선택 모달 */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <TouchableOpacity
          style={styles.modalContainer}
          activeOpacity={1} // 모달 외부 클릭 시 투명도 효과 제거
          onPressOut={() => setModalVisible(false)} // 모달 외부 클릭 시 모달 닫기
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>은행 선택</Text>
            <FlatList
              data={banks}
              keyExtractor={item => item.id}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.bankItem}
                  onPress={() => selectBank(item.name)}>
                  <Text>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  bankSelectButton: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 모달의 반투명 배경
  },
  modalContent: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  bankItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    width: '100%',
    alignItems: 'center',
  },
});

export default AddAccountScreen;
