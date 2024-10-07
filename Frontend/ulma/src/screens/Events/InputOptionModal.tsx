import {colors} from '@/constants';
import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import Modal from 'react-native-modal';
import Toast from 'react-native-toast-message';
import DocumentPicker from 'react-native-document-picker';
import axiosInstance from '@/api/axios';
import useAuthStore from '@/store/useAuthStore';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {payStackParamList} from '@/navigations/stack/PayStackNavigator';
import {eventNavigations, payNavigations} from '@/constants/navigations';
import usePayStore from '@/store/usePayStore';

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

function InputOptionModal({isVisible, onClose, onDirectRegister}) {
  const [excelFile, setExcelFile] = useState(null);
  const {accessToken} = useAuthStore();
  const navigation = useNavigation();
  const {getAccountInfo} = usePayStore();

  // 계좌 내역 불러오기
  const handleAccountHistory = () => {
    // 계좌 내역 불러오기 로직 구현
    console.log('계좌 내역 불러오기 실행');
    getAccountInfo();
    navigation.navigate(eventNavigations.ACCOUNT_HISTORY);
    onClose(); // 모달 닫기
  };

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
  const handleSubmit = async () => {
    if (!excelFile) {
      Toast.show({
        type: 'error',
        text1: '엑셀 파일을 선택해주세요.',
      });
      return;
    }

    const formData = new FormData();
    const name = excelFile.name;
    formData.append('file', {
      name,
      type: excelFile.type,
      uri: excelFile.uri,
    });

    try {
      const {
        data: {path},
      } = await axiosInstance.post('/participant/money/excel', formData, {
        headers: {
          'content-type': 'multipart/form-data',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      Toast.show({
        type: 'success',
        text1: '파일 업로드 성공',
      });
      onClose();
    } catch (e) {
      Toast.show({
        type: 'error',
        text1: '파일 업로드 실패',
        text2: '다시 시도해주세요.',
      });
    }
  };

  // 직접 등록하기
  const handleDirectRegister = () => {
    onDirectRegister(); // 직접 등록하기 호출
    onClose(); // 모달 닫기
  };

  const handlePress = (key: string) => {
    if (key === '1') {
      handleAccountHistory();
    } else if (key === '2') {
      pickExcelFile();
    } else if (key === '3') {
      handleDirectRegister();
    }
  };

  const renderItem = ({item}: {item: (typeof options)[0]}) => (
    <TouchableOpacity onPress={() => handlePress(item.key)}>
      <View style={styles.optionContainer}>
        <Image style={styles.icon} source={item.imageUrl} />
        <View style={styles.textContainer}>
          <Text style={styles.optionLabel}>{item.label}</Text>
          <Text style={styles.optionDescription}>{item.description}</Text>
        </View>
        <View style={styles.arrow}>
          <Icon name="chevron-right" size={20} color={colors.BLACK} />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      style={styles.modalContainer}>
      <View style={styles.modalBody}>
        <FlatList
          data={options}
          renderItem={renderItem}
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
    backgroundColor: colors.WHITE,
    paddingBottom: '20%',
    paddingTop: '3%',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  uploadButton: {
    backgroundColor: colors.PRIMARY,
    padding: 15,
    margin: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  uploadButtonText: {
    color: colors.WHITE,
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
    color: colors.GRAY_700,
    marginTop: 5,
  },
  arrow: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default InputOptionModal;
