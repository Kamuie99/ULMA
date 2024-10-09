import axiosInstance from '@/api/axios';
import {colors} from '@/constants';
import Icon from 'react-native-vector-icons/Entypo';
import useAuthStore from '@/store/useAuthStore';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {FlatList, ScrollView} from 'react-native-gesture-handler';
import {payNavigations} from '@/constants/navigations';
import Toast from 'react-native-toast-message';
import usePayStore from '@/store/usePayStore';
import CustomButton from '@/components/common/CustomButton';

interface Transaction {
  id: string;
  date: string;
  guest: string;
  amount: string;
  description: string;
  type: 'send' | 'receive';
}

function PayHomeScreen() {
  const {makeAccount, getPayInfo, getAccountInfo, balance} = usePayStore();
  const [payHistory, setPayHistory] = useState<Transaction[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  // fetchData 함수를 컴포넌트 외부에서도 호출 가능하도록 분리
  const fetchPayInfo = async () => {
    try {
      await getPayInfo();
      await getAccountInfo();
    } catch (error) {
      console.error('데이터를 불러오는 중 에러가 발생했습니다.', error);
    }
  };

  const fetchPayHistory = async () => {
    try {
      const response = await axiosInstance.get('/users/pay', {
        params: {
          page: 0, // 현재 페이지
          size: 10, // 페이지당 항목 수
        },
      });
      const formattedData: Transaction[] = response.data.data.map(
        (item: any) => ({
          id: item.transactionDate,
          amount: item.amount,
          date: item.transactionDate.slice(0, 10),
          guest: item.counterpartyName,
          description: item.description,
          type: item.transactionType === 'SEND' ? 'send' : 'receive',
        }),
      );
      setPayHistory(formattedData);
    } catch (error) {
      console.error('계좌 이력을 불러오는 중 에러가 발생했습니다:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchPayInfo();
    }, [getPayInfo, getAccountInfo]),
  );

  useFocusEffect(
    useCallback(() => {
      fetchPayHistory();
    }, []),
  );

  const navigation = useNavigation();

  const renderTransaction = ({item}: {item: Transaction}) => (
    <View style={styles.transactionItem}>
      <View style={styles.iconContainer}>
        <Text style={styles.iconText}>PAY</Text>
      </View>
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionText}>{item.guest}</Text>
        <Text style={styles.dateText}>
          {item.description} | {item.date}
        </Text>
      </View>
      <Text
        style={[
          styles.amountText,
          item.type === 'send' ? styles.negative : styles.positive,
        ]}>
        {item.type === 'send'
          ? `-${Number(item.amount).toLocaleString()}`
          : Number(item.amount).toLocaleString()}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.boxContainer}>
        <Text style={styles.title}>Pay 머니</Text>
        {balance >= 0 ? (
          <>
            <Text style={styles.balance}>
              {Number(balance).toLocaleString()} 원
            </Text>
          </>
        ) : (
          <>
            <Text>연결된 페이 서비스가 확인되지 않아요 😯</Text>
            <TouchableOpacity
              style={styles.connectButton}
              onPress={() => setModalVisible(true)}>
              <Text style={styles.connectButtonText}>Ulma Pay 시작하기</Text>
              <Icon name="chevron-right" size={24} color={colors.GREEN_700} />
            </TouchableOpacity>
          </>
        )}
      </View>
      <View style={styles.boxContainer}>
        <Text style={styles.title}>Pay 설정</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate(payNavigations.ACCOUNT_INFO)}>
            <Image
              source={require('@/assets/Pay/menu/accountInfo.png')}
              style={styles.buttonImage}
            />
            <Text>내 계좌 보기</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate(payNavigations.SEND_ACCOUNT)}>
            <Image
              source={require('@/assets/Pay/menu/sendMoney.png')}
              style={styles.buttonImage}
            />
            <Text>송금하기</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate(payNavigations.PAY_RECHARGE)}>
            <Image
              source={require('@/assets/Pay/menu/chargePay.png')}
              style={styles.buttonImage}
            />
            <Text>Pay 충전</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.boxContainer}>
        <Text style={styles.title}>Pay 이력</Text>
        <View>
          {payHistory.length > 0 ? (
            <>
              <View>
                <View>
                  {/* 송금 내역 리스트 */}
                  <FlatList
                    data={[...payHistory, {id: 'loadMore', type: 'loadMore'}]} // 데이터에 더보기 항목 추가
                    renderItem={({item}) =>
                      item.type === 'loadMore' ? (
                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate(payNavigations.PAY_LIST)
                          }>
                          <Text style={styles.moreBtn}>더보기</Text>
                        </TouchableOpacity>
                      ) : (
                        renderTransaction({item})
                      )
                    }
                    keyExtractor={item => item.id}
                    style={{maxHeight: '90%'}}
                  />
                </View>
              </View>
            </>
          ) : (
            <Text>내역이 없습니다.</Text> // 데이터가 없을 때 표시
          )}
        </View>
      </View>

      {/* 모달창 */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Ulma Pay 서비스를 시작하시겠습니까?
            </Text>
            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={async () => {
                  await makeAccount();
                  await fetchPayInfo(); // makeAccount 후 정보 갱신
                  await fetchPayHistory(); // makeAccount 후 이력 갱신
                  setModalVisible(false); // 모달 닫기
                }}>
                <Text style={styles.actionButtonText}>시작하기</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.actionButtonText}>닫기</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const screenWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.LIGHTGRAY,
    padding: 15,
    gap: 15,
  },
  boxContainer: {
    backgroundColor: colors.WHITE,
    borderRadius: 15,
    padding: 20,
  },
  title: {
    fontWeight: 'bold',
    color: colors.BLACK,
    marginBottom: 10,
  },
  connectButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: colors.GREEN_300,
    borderWidth: 2,
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
  },
  connectButtonText: {
    color: colors.GREEN_700,
    fontWeight: 'bold',
  },
  balance: {
    fontSize: 22,
    textAlign: 'right',
    color: colors.BLACK,
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonImage: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    marginHorizontal: 10,
    marginBottom: 10,
  },
  moreBtn: {
    marginTop: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },

  // modal 스타일
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    marginBottom: 20,
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    backgroundColor: colors.GREEN_700,
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: colors.GRAY_700,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.GRAY_300,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.GREEN_700,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.WHITE,
  },
  transactionDetails: {
    flex: 1,
    paddingHorizontal: 10,
  },
  transactionText: {
    fontSize: 16,
  },
  dateText: {
    fontSize: 12,
    color: colors.GRAY_700,
  },
  amountText: {
    fontSize: 16,
  },
  positive: {
    color: colors.PINK,
    fontWeight: 'bold',
  },
  negative: {
    color: colors.BLACK,
  },
});

export default PayHomeScreen;
