import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, Modal, FlatList, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { colors } from '@/constants';
import { useNavigation } from '@react-navigation/native';
import axiosInstance from '@/api/axios';
import Contacts from 'react-native-contacts';
import Icon from 'react-native-vector-icons/Ionicons';
import CheckBox from '@react-native-community/checkbox';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

const categories = ['가족', '친척', '친구', '직장', '지인', '학교', '기타'];

// 휴대폰 번호 정규식 검증 함수
function phoneNumberCheck(number) {
  let result = /^(01[016789]{1})-?[0-9]{3,4}-?[0-9]{4}$/;
  return result.test(number);
}

// 전화번호에 하이픈을 넣어주는 함수
const formatPhoneNumber = (number) => {
  const cleaned = ('' + number).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3,4})(\d{4})$/);
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`;
  }
  return number;
};

// 하이픈을 제거하고 번호를 반환하는 함수
const cleanPhoneNumber = (number) => {
  return number.replace(/-/g, '');
};

// 카테고리별 색상을 반환하는 함수
const getCategoryColor = (category) => {
  switch (category) {
    case '가족':
      return colors.PINK;
    case '친척':
      return colors.PINK;
    case '친구':
      return colors.GREEN_700;
    case '직장':
      return colors.PASTEL_BLUE;
    case '지인':
      return colors.PASTEL_BLUE;
    case '기타':
      return colors.GRAY_300;
    case '학교':
      return colors.PURPLE;
    default: return '#e0e0e0';
  }
};

function AddFriendScreen() {
  const [friends, setFriends] = useState([{ name: '', category: '', phoneNumber: '', withoutPhoneNumber: false }]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentEditIndex, setCurrentEditIndex] = useState(0);
  const [contactsModalVisible, setContactsModalVisible] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContacts, setSelectedContacts] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    if (contacts.length > 0) {
      const sortedContacts = contacts.sort((a, b) => a.givenName.localeCompare(b.givenName));
      setFilteredContacts(sortedContacts);
    }
  }, [contacts]);

  const requestContactsPermission = async () => {
    const result = await check(PERMISSIONS.ANDROID.READ_CONTACTS);
    if (result === RESULTS.DENIED) {
      const permissionResult = await request(PERMISSIONS.ANDROID.READ_CONTACTS);
      if (permissionResult !== RESULTS.GRANTED) {
        Alert.alert('오류', '연락처 접근 권한이 필요합니다.');
        return false;
      }
    }
    return true;
  };

  const handleAddFriend = async () => {
    // 필드 확인 및 휴대폰 번호 정규식 체크
    for (let friend of friends) {
      if (!friend.name || !friend.category) {
        Alert.alert('오류', '이름과 카테고리 선택은 필수입니다!');
        return;
      }
      // 전화번호가 없는 경우는 검증하지 않고 넘어감
      if (!friend.withoutPhoneNumber && !phoneNumberCheck(cleanPhoneNumber(friend.phoneNumber))) {
        Alert.alert('오류', '휴대폰 번호를 다시 확인해주세요.');
        return;
      }
    }

    // 전송할 친구 목록에서 전화번호가 없는 친구는 phoneNumber 필드를 제거
    const dataToSend = friends.map(friend => {
      const { name, category, phoneNumber, withoutPhoneNumber } = friend;
      return withoutPhoneNumber ? { name, category } : { name, category, phoneNumber: cleanPhoneNumber(phoneNumber) };
    });

    try {
      const response = await axiosInstance.post('/participant', dataToSend);
      if (response.status === 200) {
        Alert.alert('등록 성공', '지인 등록이 성공적으로 완료되었습니다.', [
          { text: '확인', onPress: () => navigation.goBack() }
        ]);
      }
    } catch (error) {
      console.error('지인 등록 실패:', error);
      Alert.alert('등록 실패', '이미 등록된 지인이 포함되어 있습니다. \n다시 등록해주세요.');
    }
  };

  const openContacts = async () => {
    const hasPermission = await requestContactsPermission();
    if (!hasPermission) return;

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

  const toggleContactSelection = (contact) => {
    setSelectedContacts(prevSelected => {
      if (prevSelected.some(c => c.recordID === contact.recordID)) {
        return prevSelected.filter(c => c.recordID !== contact.recordID);
      } else {
        return [...prevSelected, contact];
      }
    });
  };

  const confirmSelectedContacts = () => {
    const newFriends = selectedContacts.map(contact => ({
      name: contact.givenName,
      phoneNumber: formatPhoneNumber(contact.phoneNumbers[0]?.number || ''),
      category: '',
      withoutPhoneNumber: false
    }));

    setFriends(prevFriends => {
      const updatedFriends = [...prevFriends];
      // 첫 번째 빈 카드를 덮어쓰기
      if (updatedFriends[0] && !updatedFriends[0].name) {
        updatedFriends[0] = newFriends.shift(); // 첫 번째 빈 카드에 연락처 중 하나를 덮어씌움
      }
      // 남은 연락처는 추가
      return [...updatedFriends, ...newFriends];
    });

    setContactsModalVisible(false);
    setSelectedContacts([]);
  };

  const openCategoryModal = (index) => {
    setCurrentEditIndex(index);
    setModalVisible(true);
  };

  const selectCategory = (category) => {
    const updatedFriends = [...friends];
    updatedFriends[currentEditIndex].category = category;
    setFriends(updatedFriends);
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

  const addFriendCard = () => {
    setFriends([...friends, { name: '', category: '', phoneNumber: '', withoutPhoneNumber: false }]);
  };

  const removeFriendCard = (index) => {
    const updatedFriends = friends.filter((_, i) => i !== index);
    setFriends(updatedFriends);
  };

  const updateFriendField = (index, field, value) => {
    const updatedFriends = [...friends];
    if (field === 'phoneNumber') {
      updatedFriends[index][field] = formatPhoneNumber(value);
    } else {
      updatedFriends[index][field] = value;
    }
    setFriends(updatedFriends);
  };

  const toggleWithoutPhoneNumber = (index) => {
    const updatedFriends = [...friends];
    updatedFriends[index].withoutPhoneNumber = !updatedFriends[index].withoutPhoneNumber;
    // 전화번호 입력 칸을 지우고 회색 배경으로 설정
    if (updatedFriends[index].withoutPhoneNumber) {
      updatedFriends[index].phoneNumber = '';
    }
    setFriends(updatedFriends);
  };

  const selectAllContacts = () => {
    setSelectedContacts(filteredContacts);
  };

  const deselectAllContacts = () => {
    setSelectedContacts([]);
  };

  return (
    <ScrollView style={styles.container}>
      {friends.map((friend, index) => (
        <View key={index} style={styles.friendCard}>
          <View style={styles.nameRow}>
            <TextInput
              style={styles.input}
              value={friend.name}
              onChangeText={(text) => updateFriendField(index, 'name', text)}
              placeholder="이름"
              placeholderTextColor={colors.GRAY_300}
            />
            <TouchableOpacity
              style={[
                styles.categoryButton,
                { backgroundColor: getCategoryColor(friend.category) }
              ]}
              onPress={() => openCategoryModal(index)}
            >
              <Text
                style={[
                  styles.categoryButtonText,
                  friend.category ? styles.selectedCategoryText : styles.unselectedCategoryText
                ]}
              >
                {friend.category || '카테고리 선택'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.phoneRow}>
            <TextInput
              style={[
                styles.input,
                friend.withoutPhoneNumber ? styles.disabledInput : null
              ]}
              value={friend.phoneNumber}
              onChangeText={(text) => updateFriendField(index, 'phoneNumber', text)}
              placeholder="전화번호"
              placeholderTextColor={colors.GRAY_300}
              keyboardType="phone-pad"
              editable={!friend.withoutPhoneNumber}
            />
            <CheckBox
              value={friend.withoutPhoneNumber}
              onValueChange={() => toggleWithoutPhoneNumber(index)}
            />
            <Text>전화번호 없이</Text>
            <TouchableOpacity 
              style={styles.removeButton} 
              onPress={() => removeFriendCard(index)}
              disabled={friends.length === 1} // 카드가 1개일 때 비활성화
            >
              {friends.length > 1 && (
                <Icon name="remove-circle-outline" size={24} color={colors.PINK} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      ))}

      <TouchableOpacity style={styles.addButton} onPress={addFriendCard}>
        <Icon name="add-circle-outline" size={24} color={colors.GREEN_700} />
        <Text style={styles.addButtonText}>지인 추가</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.contactsButton} onPress={openContacts}>
        <Icon name="people-outline" size={24} color={colors.WHITE} />
        <Text style={styles.contactsButtonText}>연락처에서 가져오기</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.registerButton} onPress={handleAddFriend}>
        <Text style={styles.registerButtonText}>등록</Text>
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
          {/* 전체 선택 / 전체 해제 버튼 */}
          <View style={styles.selectButtonsContainer}>
            <TouchableOpacity style={styles.selectButton} onPress={selectAllContacts}>
              <Text style={styles.selectButtonText}>전체 선택</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.selectButton} onPress={deselectAllContacts}>
              <Text style={styles.selectButtonText}>전체 해제</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={filteredContacts}
            keyExtractor={item => item.recordID}
            renderItem={({ item }) => (
              <TouchableOpacity 
                onPress={() => toggleContactSelection(item)} 
                style={[
                  styles.contactItem,
                  selectedContacts.some(c => c.recordID === item.recordID) && styles.selectedContactItem
                ]}
              >
                <Text style={styles.contactItemText}>{item.givenName} - {item.phoneNumbers[0]?.number}</Text>
                {selectedContacts.some(c => c.recordID === item.recordID) && (
                  <Icon name="checkmark-circle" size={24} color={colors.GREEN_700} />
                )}
              </TouchableOpacity>
            )}
          />
          <View style={styles.contactModalFooter}>
            <TouchableOpacity onPress={() => setContactsModalVisible(false)} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={confirmSelectedContacts} style={styles.confirmButton}>
              <Text style={styles.confirmButtonText}>확인 ({selectedContacts.length})</Text>
            </TouchableOpacity>
          </View>
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
  friendCard: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.GRAY_300,
    borderRadius: 8,
    padding: 10,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  phoneRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: colors.GRAY_300,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  disabledInput: {
    backgroundColor: colors.GRAY_100, // 전화번호 없는 경우 회색 배경
  },
  categoryButton: {
    padding: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 100,
  },
  selectedCategoryButton: {
    backgroundColor: colors.GREEN_700, // 선택된 카테고리 버튼의 색상
  },
  unselectedCategoryButton: {
    backgroundColor: colors.GRAY_300, // 선택되지 않았을 때의 배경색
    borderColor: colors.GRAY_300,
    borderWidth: 1, // 테두리 추가
  },
  categoryButtonText: {
    fontSize: 14,
  },
  selectedCategoryText: {
    color: colors.WHITE, // 선택된 카테고리의 텍스트 색상
  },
  unselectedCategoryText: {
    color: colors.WHITE, // 선택되지 않았을 때의 텍스트 색상
  },
  removeButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    marginLeft: 10,
    color: colors.GREEN_700,
    fontSize: 16,
  },
  contactsButton: {
    flexDirection: 'row',
    backgroundColor: colors.GREEN_700,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  contactsButtonText: {
    color: colors.WHITE,
    fontSize: 16,
    marginLeft: 10,
  },
  registerButton: {
    backgroundColor: colors.GREEN_700,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  registerButtonText: {
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.GRAY_100,
  },
  selectedContactItem: {
    backgroundColor: colors.GREEN_300,
  },
  contactItemText: {
    fontSize: 16,
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
  selectButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  selectButton: {
    padding: 10,
    backgroundColor: colors.GREEN_700,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  selectButtonText: {
    color: colors.WHITE,
    fontSize: 16,
  },
  contactModalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    padding: 15,
    backgroundColor: colors.GRAY_300,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  cancelButtonText: {
    color: colors.BLACK,
    fontSize: 16,
  },
  confirmButton: {
    padding: 15,
    backgroundColor: colors.GREEN_700,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
  },
  confirmButtonText: {
    color: colors.WHITE,
    fontSize: 16,
  },
});

export default AddFriendScreen;
