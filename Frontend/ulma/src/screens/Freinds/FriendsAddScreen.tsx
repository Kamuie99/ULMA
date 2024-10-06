import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, Modal, FlatList, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { colors } from '@/constants';
import { useNavigation } from '@react-navigation/native';
import axiosInstance from '@/api/axios';
import Contacts from 'react-native-contacts';
import Icon from 'react-native-vector-icons/Ionicons';

const categories = ['가족', '친구', '친척', '직장', '학교', '지인', '기타'];

function AddFriendScreen() {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [contactsModalVisible, setContactsModalVisible] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    if (contacts.length > 0) {
      const sortedContacts = contacts.sort((a, b) => a.givenName.localeCompare(b.givenName));
      setFilteredContacts(sortedContacts);
    }
  }, [contacts]);

  const handleAddFriend = async () => {
    if (!name || !category || !phoneNumber) {
      Alert.alert('오류', '이름, 카테고리, 전화번호를 모두 입력해주세요.');
      return;
    }

    try {
      const response = await axiosInstance.post('/participant', [{
        name,
        category,
        phoneNumber,
      }]);

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
      const sortedContacts = contacts.sort((a, b) => a.givenName.localeCompare(b.givenName));
      setContacts(sortedContacts);
      setFilteredContacts(sortedContacts);
      setContactsModalVisible(true);
    }).catch(error => {
      console.error('연락처를 불러오는 데 실패했습니다:', error);
      Alert.alert('오류', '연락처를 불러오는 데 실패했습니다.');
    });
  };

  const selectContact = (contact) => {
    setName(contact.givenName);
    setPhoneNumber(contact.phoneNumbers[0]?.number || '');
    setContactsModalVisible(false);
  };

  const openCategoryModal = () => {
    setModalVisible(true);
  };

  const selectCategory = (category) => {
    setCategory(category);
    setModalVisible(false);
  };

  const handleSearch = (text) => {
    setSearchTerm(text);
    if (text === '') {
      setFilteredContacts(contacts);
    } else {
      const filtered = contacts.filter(contact => 
        contact.givenName.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredContacts(filtered);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>이름</Text>
        <View style={styles.nameContainer}>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="지인의 이름을 입력하세요"
            placeholderTextColor={colors.GRAY_300}
          />
          <TouchableOpacity style={styles.iconButton} onPress={openContacts}>
            <Icon name="person-circle-outline" size={28} color={colors.WHITE} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>전화번호</Text>
        <TextInput
          style={styles.input}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholder="전화번호를 입력하세요"
          placeholderTextColor={colors.GRAY_300}
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>카테고리</Text>
        <TouchableOpacity style={styles.dropdown} onPress={openCategoryModal}>
          <Text style={styles.dropdownText}>{category || '카테고리를 선택하세요'}</Text>
          <Icon name="chevron-down-outline" size={24} color={colors.GRAY_700} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleAddFriend}>
        <Text style={styles.buttonText}>등록</Text>
      </TouchableOpacity>

      {/* 카테고리 선택 모달 */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>카테고리 선택</Text>
                <FlatList
                  data={categories}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => selectCategory(item)} style={styles.modalItem}>
                      <Text style={styles.modalItemText}>{item}</Text>
                    </TouchableOpacity>
                  )}
                />
                <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeModalButton}>
                  <Text style={styles.closeModalText}>닫기</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* 연락처 모달 */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={contactsModalVisible}
        onRequestClose={() => setContactsModalVisible(false)}
      >
        <View style={styles.contactsContainer}>
          <TextInput
            style={styles.searchBar}
            placeholder="연락처 검색"
            placeholderTextColor={colors.GRAY_300}
            value={searchTerm}
            onChangeText={handleSearch}
          />
          <FlatList
            data={filteredContacts}
            keyExtractor={item => item.recordID}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => selectContact(item)} style={styles.contactItem}>
                <Text style={styles.contactItemText}>{item.givenName} - {item.phoneNumbers[0]?.number}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity onPress={() => setContactsModalVisible(false)} style={styles.closeModalButton}>
            <Text style={styles.closeModalText}>닫기</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
    padding: 20,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: colors.GRAY_700,
    marginBottom: 5,
  },
  input: {
    height: 50,
    flex: 1,
    borderWidth: 1,
    borderColor: colors.GRAY_300,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: colors.BLACK,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
    borderWidth: 1,
    borderColor: colors.GRAY_300,
    borderRadius: 8,
    padding: 10,
  },
  dropdownText: {
    fontSize: 16,
    color: colors.GRAY_700,
  },
  iconButton: {
    marginLeft: 10,
    backgroundColor: colors.GREEN_700,
    padding: 8,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    width: 50,
  },
  button: {
    backgroundColor: colors.GREEN_700,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.WHITE,
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: colors.WHITE,
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.GRAY_100,
  },
  modalItemText: {
    fontSize: 16,
    color: colors.BLACK,
  },
  closeModalButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: colors.GREEN_700,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeModalText: {
    color: colors.WHITE,
    fontSize: 16,
  },
  contactItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.GRAY_100,
  },
  contactItemText: {
    fontSize: 18,
  },
  contactsContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.WHITE,
  },
  searchBar: {
    height: 50,
    borderWidth: 1,
    borderColor: colors.GRAY_300,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: colors.BLACK,
    marginBottom: 20,
  },
});

export default AddFriendScreen;
