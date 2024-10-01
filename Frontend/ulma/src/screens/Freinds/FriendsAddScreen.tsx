import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, Modal, FlatList } from 'react-native';
import { colors } from '@/constants';
import { useNavigation } from '@react-navigation/native';
import axiosInstance from '@/api/axios';
import Contacts from 'react-native-contacts';

function AddFriendScreen() {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [contacts, setContacts] = useState([]);
  const navigation = useNavigation();

  const handleAddFriend = async () => {
    if (!name || !category || !phoneNumber) {
      Alert.alert('오류', '이름, 카테고리, 전화번호를 모두 입력해주세요.');
      return;
    }

    try {
      const response = await axiosInstance.post('/participant', {
        name,
        category,
        phoneNumber,
      });

      if (response.status === 200) {
        Alert.alert('성공', '지인이 성공적으로 등록되었습니다.', [
          { text: '확인', onPress: () => navigation.goBack() }
        ]);
      }
    } catch (error) {
      console.error('지인 등록 실패:', error);
      Alert.alert('오류', '지인 등록에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const openContacts = () => {
    Contacts.getAll().then(contacts => {
      setContacts(contacts);
      setModalVisible(true);
    }).catch(error => {
      console.error('연락처를 불러오는 데 실패했습니다:', error);
      Alert.alert('오류', '연락처를 불러오는 데 실패했습니다.');
    });
  };

  const selectContact = (contact) => {
    setName(contact.givenName);
    setPhoneNumber(contact.phoneNumbers[0]?.number || '');
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>이름</Text>
      <View style={styles.nameContainer}>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="지인의 이름을 입력하세요"
        />
        <TouchableOpacity style={styles.contactButton} onPress={openContacts}>
          <Text style={styles.contactButtonText}>연락처</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>전화번호</Text>
      <TextInput
        style={styles.input}
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        placeholder="전화번호를 입력하세요"
      />

      <Text style={styles.label}>카테고리</Text>
      <TextInput
        style={styles.input}
        value={category}
        onChangeText={setCategory}
        placeholder="카테고리를 입력하세요 (예: 친구, 가족)"
      />

      <TouchableOpacity style={styles.button} onPress={handleAddFriend}>
        <Text style={styles.buttonText}>등록</Text>
      </TouchableOpacity>

      {/* 연락처 모달 */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>내 연락처 가져오기</Text>
          <FlatList
            data={contacts}
            keyExtractor={item => item.recordID}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => selectContact(item)}>
                <Text style={styles.contactItem}>{item.givenName} - {item.phoneNumbers[0]?.number}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeModalButton}>
            <Text style={styles.closeModalText}>닫기</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.WHITE,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: colors.BLACK,
  },
  input: {
    height: 50, // 높이 고정
    borderWidth: 1,
    borderColor: colors.GRAY_300,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: colors.GREEN_700,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.WHITE,
    fontSize: 18,
    fontWeight: 'bold',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactButton: {
    marginLeft: 10,
    marginBottom: 20,
    backgroundColor: colors.GREEN_700,
    padding: 10,
    borderRadius: 5,
    width: 70,
    height: 50,
    alignItems: 'center',
  },
  contactButtonText: {
    color: colors.WHITE,
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.WHITE,
  },
  contactItem: {
    fontSize: 18,
    padding: 10,
  },
  closeModalButton: {
    padding: 15,
    backgroundColor: colors.GREEN_700,
    alignItems: 'center',
    borderRadius: 5,
  },
  closeModalText: {
    color: colors.WHITE,
    fontSize: 16,
  },
  modalTitle: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  }
});

export default AddFriendScreen;
