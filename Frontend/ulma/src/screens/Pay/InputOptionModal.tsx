import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import Modal from 'react-native-modal';
import Toast from 'react-native-toast-message';
import DocumentPicker from 'react-native-document-picker';
import axiosInstance from '@/api/axios';
import useAuthStore from '@/store/useAuthStore';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {payNavigations} from '@/constants/navigations';
import {DocumentPickerResponse} from 'react-native-document-picker';

const options = [
  {
    key: '1',
    label: '계좌 내역 불러오기',
    description: '계좌 내역에서 선택 후 바로 등록해보세요.',
    imageUrl: require('@/assets/Pay/modal/option1.png'),
  },
  {
    key: '2',
    label: '엑셀 등록하기',
    description: '적어 놓은 내역을 등록해보세요.',
    imageUrl: require('@/assets/Pay/modal/option2.png'),
  },
  {
    key: '3',
    label: '직접 등록하기',
    description: '직접 받은 경조사비를 등록해보세요.',
    imageUrl: require('@/assets/Pay/modal/option3.png'),
  },
];

function InputOptionModal({ isVisible, onClose, onDirectRegister, onSubmit }) {
  const [excelFile, setExcelFile] = useState<DocumentPickerResponse | null>(null);

  // 엑셀 파일 선택
  const pickExcelFile = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.xlsx],
      });
      setExcelFile(res[0]);
      console.log('선택된 파일: ', res);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('파일 선택이 취소되었습니다.');
      } else {
        console.error('파일 선택 오류:', err);
      }
    }
    onClose(); // 모달 닫기
  };

  // 엑셀 파일 업로드
  const handleSubmit = () => {
    if (excelFile) {
      onSubmit(excelFile); // 부모 컴포넌트로 파일 전달
      onClose(); // 모달 닫기
    } else {
      Alert.alert('엑셀 파일을 선택해주세요.');
    }
  };

  const handlePress = (key: string) => {
    if (key === '1') {
      // 계좌 내역 불러오기
    } else if (key === '2') {
      pickExcelFile();
    } else if (key === '3') {
      onDirectRegister(); // 직접 등록하기 로직
    }
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      style={styles.modalContainer}>
      <View style={styles.modalBody}>
        <FlatList
          data={options}
          renderItem={({item}) => (
            <TouchableOpacity onPress={() => handlePress(item.key)}>
              <View style={styles.optionContainer}>
                <Image style={styles.icon} source={item.imageUrl} />
                <View style={styles.textContainer}>
                  <Text style={styles.optionLabel}>{item.label}</Text>
                  <Text style={styles.optionDescription}>
                    {item.description}
                  </Text>
                </View>
                <Icon name="chevron-right" size={20} color="#000" />
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.key}
        />
      </View>
      {excelFile && (
        <TouchableOpacity style={styles.uploadButton} onPress={handleSubmit}>
          <Text style={styles.uploadButtonText}>엑셀 파일 업로드</Text>
        </TouchableOpacity>
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },
  modalBody: {
    backgroundColor: 'white',
    paddingBottom: '20%',
    paddingTop: '3%',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  uploadButton: {
    backgroundColor: '#00C77F',
    padding: 15,
    margin: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  uploadButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  icon: {
    width: 28,
    height: 28,
    marginRight: 7,
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: 'black',
  },
  optionDescription: {
    fontSize: 13,
    fontWeight: '400',
    color: '#777',
    marginTop: 5,
  },
  arrow: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default InputOptionModal;
