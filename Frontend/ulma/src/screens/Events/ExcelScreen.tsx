import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
} from 'react-native';
import DocumentPicker, { DocumentPickerResponse } from 'react-native-document-picker';
import axiosInstance from '@/api/axios';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { eventStackParamList } from '@/navigations/stack/EventStackNavigator';

interface ExcelScreenProps {
  route: RouteProp<eventStackParamList, 'EVENT_DETAIL'>;
  navigation: NavigationProp<eventStackParamList>;
}

interface ExcelEntry {
  name: string;
  category: string;
  amount: number;
}

const ExcelScreen: React.FC<ExcelScreenProps> = ({ route, navigation }) => {
  const { event_id } = route.params;
  const [selectedFile, setSelectedFile] = useState<DocumentPickerResponse | null>(null);
  const [excelData, setExcelData] = useState<ExcelEntry[]>([]);

  // 엑셀 파일 선택 및 API 요청 함수
  const pickExcelFile = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.xlsx],
      });
      setSelectedFile(res[0]);

      // 서버로 엑셀 파일 전송 및 파싱 요청
      const formData = new FormData();
      formData.append('file', {
        name: res[0].name,
        type: res[0].type,
        uri: res[0].uri,
      });

      // API 호출 시 인증 토큰은 axiosInstance에서 자동으로 처리됩니다.
      const response = await axiosInstance.post('/participant/money/excel', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setExcelData(response.data);
      Alert.alert('파일 업로드 완료', '파일이 성공적으로 업로드되었습니다.');
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        Alert.alert('취소됨', '파일 선택이 취소되었습니다.');
      } else {
        console.error('파일 선택 중 오류 발생:', err);
        Alert.alert('오류', '파일 선택 중 오류가 발생했습니다.');
      }
    }
  };

  // 지인 검색 함수
  const checkParticipant = async (entry: ExcelEntry) => {
    try {
      const response = await axiosInstance.get('/participant/same', {
        params: { name: entry.name, category: entry.category },
      });

      if (response.data.data.length > 0) {
        const participant = response.data.data[0];
        Alert.alert(
          '확인',
          `지인 "${participant.name}"이(가) 발견되었습니다. 이 사용자가 맞습니까?`,
          [
            {
              text: '아니요',
              onPress: () => registerNewParticipant(entry),
            },
            {
              text: '예',
              onPress: () => registerTransaction(entry, participant.guestId),
            },
          ],
        );
      } else {
        Alert.alert(
          '새 지인 등록',
          `${entry.name}(${entry.category}) 지인이 없습니다. 등록하시겠습니까?`,
          [
            { text: '취소', onPress: () => console.log('등록 취소') },
            {
              text: '등록',
              onPress: () => registerNewParticipant(entry),
            },
          ],
        );
      }
    } catch (error) {
      console.error('지인 검색 중 오류 발생:', error);
      Alert.alert('오류', '지인 검색 중 오류가 발생했습니다.');
    }
  };

  // 지인 등록 함수
  const registerNewParticipant = async (entry: ExcelEntry) => {
    try {
      const response = await axiosInstance.post('/participant', {
        name: entry.name,
        category: entry.category,
        phoneNumber: '',
      });

      registerTransaction(entry, response.data.guestId);
    } catch (error) {
      console.error('지인 등록 중 오류 발생:', error);
      Alert.alert('오류', '지인 등록 중 오류가 발생했습니다.');
    }
  };

  // 거래내역 추가 함수
  const registerTransaction = async (entry: ExcelEntry, guestId: number) => {
    try {
      await axiosInstance.post('/participant/money', {
        eventId: event_id,
        guestId: guestId,
        amount: entry.amount,
      });

      Alert.alert('성공', `${entry.name}님의 거래내역이 등록되었습니다.`);
    } catch (error) {
      console.error('거래내역 등록 중 오류 발생:', error);
      Alert.alert('오류', '거래내역 등록 중 오류가 발생했습니다.');
    }
  };

  // 각 항목별 지인 조회 및 거래내역 등록 함수
  const processEntries = async () => {
    for (const entry of excelData) {
      await checkParticipant(entry);
    }
  };

  const renderItem = ({ item }: { item: ExcelEntry }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>이름: {item.name}</Text>
      <Text style={styles.itemText}>카테고리: {item.category}</Text>
      <Text style={styles.itemText}>금액: {item.amount}원</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={pickExcelFile}>
        <Text style={styles.buttonText}>엑셀 파일 선택하기</Text>
      </TouchableOpacity>
      {excelData.length > 0 && (
        <>
          <FlatList
            data={excelData}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            style={styles.list}
          />
          <TouchableOpacity style={styles.processButton} onPress={processEntries}>
            <Text style={styles.buttonText}>거래내역 등록하기</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#3498db',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  list: {
    width: '100%',
  },
  itemContainer: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  itemText: {
    fontSize: 14,
    marginVertical: 2,
  },
  processButton: {
    backgroundColor: '#2ecc71',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 20,
  },
});

export default ExcelScreen;
