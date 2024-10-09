import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import axiosInstance from '@/api/axios';
import {NavigationProp, RouteProp} from '@react-navigation/native';
import {eventStackParamList} from '@/navigations/stack/EventStackNavigator';

interface ExcelScreenProps {
  route: RouteProp<eventStackParamList, 'EVENT_DETAIL'>;
  navigation: NavigationProp<eventStackParamList>;
}

interface ExcelEntry {
  isRegistered: boolean;
  guestId: number;
  name: string;
  category: string;
  amount: number;
  phoneNumber?: string;
}

const ExcelScreen: React.FC<ExcelScreenProps> = ({route, navigation}) => {
  const {event_id} = route.params;
  const [excelData, setExcelData] = useState<ExcelEntry[]>([]);
  const [unregisteredEntries, setUnregisteredEntries] = useState<ExcelEntry[]>(
    [],
  );
  const [registeredEntries, setRegisteredEntries] = useState<ExcelEntry[]>([]);
  const [fileSelected, setFileSelected] = useState(false);
  const [transactionsRegistered, setTransactionsRegistered] = useState(false); // 거래내역 등록 완료 상태

  useEffect(() => {
    fetchRegisteredParticipants();
  }, []);

  // 기존 등록된 지인 정보 가져오기
  const fetchRegisteredParticipants = async () => {
    try {
      const response = await axiosInstance.get('/participant', {
        params: {size: 100, page: 1},
      });
      setRegisteredEntries(response.data.data);
    } catch (error) {
      console.error('지인 정보 가져오기 실패:', error);
      Alert.alert('오류', '기존 지인 정보를 불러오는 데 실패했습니다.');
    }
  };

  // 엑셀 파일 선택 및 API 요청 함수
  const pickExcelFile = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.xlsx],
      });

      const formData = new FormData();
      formData.append('file', {
        name: res[0].name,
        type: res[0].type,
        uri: res[0].uri,
      });

      const response = await axiosInstance.post(
        '/participant/money/excel',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      const filteredData = response.data.filter(
        (entry: ExcelEntry) =>
          !registeredEntries.some(
            reg => reg.name === entry.name && reg.category === entry.category,
          ),
      );

      setExcelData(response.data);
      setUnregisteredEntries(filteredData);
      setFileSelected(true);
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

  // 미등록 지인 일괄 등록 함수
  const registerUnregisteredEntries = async () => {
    if (unregisteredEntries.length === 0) {
      Alert.alert('알림', '등록할 지인이 없습니다.');
      return;
    }

    try {
      const dataToSend = unregisteredEntries.map(entry => {
        return entry.phoneNumber
          ? {
              name: entry.name,
              category: entry.category,
              phoneNumber: entry.phoneNumber,
            }
          : {name: entry.name, category: entry.category};
      });

      const response = await axiosInstance.post('/participant', dataToSend);

      if (response.status === 200) {
        Alert.alert('등록 성공', '미등록 지인이 성공적으로 등록되었습니다.', [
          {
            text: '확인',
            onPress: () => {
              setUnregisteredEntries([]); // 등록 후 미등록 목록 초기화
            },
          },
        ]);
      }
    } catch (error) {
      console.error('지인 등록 실패:', error);
      Alert.alert('등록 실패', '지인 등록 중 오류가 발생했습니다.');
    }
  };

  // 거래내역 일괄 등록 함수
  const registerAllTransactions = async () => {
    if (excelData.length === 0) {
      Alert.alert('알림', '등록할 거래내역이 없습니다.');
      return;
    }

    try {
      const getGuestId = async (name: string, category: string) => {
        try {
          const response = await axiosInstance.get('/participant/same', {
            params: {
              name,
              category,
              size: 1,
              page: 1,
            },
          });

          const data = response.data.data;
          if (data && data.length > 0) {
            return data[0].guestId;
          } else {
            return null;
          }
        } catch (error) {
          console.error('guestId 조회 실패:', error);
          return null;
        }
      };

      const validTransactions = await Promise.all(
        excelData.map(async entry => {
          const guestId = await getGuestId(entry.name, entry.category);

          if (!guestId) {
            console.warn(
              `${entry.name} / ${entry.category}의 guestId를 찾지 못했습니다.`,
            );
            return null;
          }

          // 이미 등록된 거래내역 확인
          if (
            registeredEntries.some(
              reg => reg.guestId === guestId && reg.amount === entry.amount,
            )
          ) {
            Alert.alert('이미 등록된 거래 내역입니다.');
            return null;
          }

          return {
            eventId: event_id ? event_id.toString() : '',
            guestId: guestId ? guestId.toString() : '',
            amount: entry.amount ? entry.amount.toString() : '',
          };
        }),
      );

      const filteredTransactions = validTransactions.filter(
        transaction => transaction !== null,
      );

      if (filteredTransactions.length === 0) {
        Alert.alert('알림', '유효한 거래내역이 없습니다.');
        return;
      }

      const response = await axiosInstance.post(
        '/participant/money',
        filteredTransactions,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.status === 200) {
        setTransactionsRegistered(true); // 모든 거래내역 등록 완료 상태로 변경
      } else {
        console.error('거래내역 등록 실패:', response.data);
        throw new Error(
          `거래내역 등록에 실패했습니다: ${response.data.message}`,
        );
      }
    } catch (error: any) {
      console.error(
        '거래내역 등록 중 오류 발생:',
        error.response?.data || error.message,
      );
      Alert.alert('이미 등록된 거래 내역입니다.');
    }
  };

  const renderUnregisteredItem = ({item}: {item: ExcelEntry}) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>
        {item.name} / {item.category}
      </Text>
    </View>
  );
  const renderTransactionItem = ({item}: {item: ExcelEntry}) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>
        {item.name} / {item.category} / 금액: {item.amount.toLocaleString()}원
      </Text>
    </View>
  );

  const renderContent = () => {
    if (transactionsRegistered) {
      return (
        <View style={styles.centeredContainer}>
          <Text style={styles.successMessage}>
            거래내역이 모두 등록 완료되었습니다.
          </Text>
        </View>
      );
    }

    return (
      <>
        {!fileSelected && (
          <TouchableOpacity style={styles.button} onPress={pickExcelFile}>
            <Text style={styles.buttonText}>엑셀 파일 선택하기</Text>
          </TouchableOpacity>
        )}
        {fileSelected && (
          <>
            {unregisteredEntries.length > 0 ? (
              <>
                <Text style={styles.sectionTitle}>미등록 지인 목록</Text>
                <FlatList
                  data={unregisteredEntries}
                  renderItem={renderUnregisteredItem}
                  keyExtractor={(item, index) => index.toString()}
                  style={styles.list}
                />
                <TouchableOpacity
                  style={styles.processButton}
                  onPress={registerUnregisteredEntries}>
                  <Text style={styles.buttonText}>
                    미등록 지인 일괄 등록하기
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <Text style={styles.sectionTitle}>모두 등록된 지인입니다</Text>
            )}
            <Text style={styles.sectionTitle}>거래내역 목록</Text>
            <FlatList
              data={excelData}
              renderItem={renderTransactionItem}
              keyExtractor={(item, index) => index.toString()}
              style={styles.list}
            />
            <TouchableOpacity
              style={styles.processButton}
              onPress={registerAllTransactions}>
              <Text style={styles.buttonText}>거래내역 일괄 등록하기</Text>
            </TouchableOpacity>
          </>
        )}
      </>
    );
  };

  return <View style={styles.container}>{renderContent()}</View>;
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
    marginVertical: 10,
  },
  itemContainer: {
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  itemText: {
    fontSize: 14,
  },
  processButton: {
    backgroundColor: '#2ecc71',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successMessage: {
    fontSize: 18,
    marginBottom: 20,
  },
});

export default ExcelScreen;
