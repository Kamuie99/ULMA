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
  date: string;
  guest: string;
  amount: string;
  description: string;
  type: 'send' | 'receive';
}

function PayHomeScreen() {
  const {accessToken} = useAuthStore();
  const {makeAccount, getPayInfo, getAccountInfo, balance} = usePayStore();
  const [payHistory, setPayHistory] = useState<Transaction[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          await getPayInfo(); // Pay 정보 가져오기
          await getAccountInfo(); // Account 정보 가져오기
        } catch (error) {
          console.error('데이터를 불러오는 중 에러가 발생했습니다.', error);
        }
      };

      fetchData();
    }, [getPayInfo, getAccountInfo]),
  );

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const response = await axiosInstance.get('/users/pay', {
            headers: {Authorization: `Bearer ${accessToken}`},
          });

          console.log(response.data.data);

          const formattedData: Transaction[] = response.data.data.map(
            (item: any) => ({
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

      fetchData();
    }, [accessToken]), // 의존성 배열에 accessToken 추가
  );

  // 거래 내역
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
        {item.type === 'send' ? `-${item.amount}` : item.amount}
      </Text>
    </View>
  );

  const bankImages = {
    하나은행: require('../../assets/Pay/banks/하나은행.png'),
  };

  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.boxContainer}>
        <Text style={styles.title}>페이머니</Text>
        {balance ? (
          <>
            <Text style={styles.balance}>{balance} 원</Text>
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
            onPress={() => navigation.navigate(payNavigations.ADD_ACCOUNT)}>
            <Image
              source={require('@/assets/Pay/menu/accountEdit.png')}
              style={styles.buttonImage}
            />
            <Text>새 계좌 등록</Text>
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
                {/* 송금 내역 리스트 */}
                <FlatList
                  data={payHistory.slice(0, 5)} // 10개의 항목만 전달
                  renderItem={renderTransaction}
                  keyExtractor={item => item.id}
                />
              </View>

              {payHistory.length > 5 && (
                <TouchableOpacity
                  onPress={() => navigation.navigate(payNavigations.PAY_LIST)}>
                  <Text style={styles.moreBtn}>더보기</Text>
                </TouchableOpacity>
              )}
            </>
          ) : (
            <Text>내역이 없습니다.</Text> // 데이터가 없을 때 표시
          )}
        </View>
      </View>

      {/* 모달창 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Ulma Pay 서비스를 시작하시겠습니까?
            </Text>
            <View>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={async () => {
                  await makeAccount();
                }}>
                <Text style={styles.closeButtonText}>시작하기</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButtonText}>닫기</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const screenWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.LIGHTGRAY,
    overflow: 'scroll',
    padding: 15,
  },
  boxContainer: {
    backgroundColor: colors.WHITE,
    borderRadius: 15,
    padding: 20,
    marginVertical: 10,
  },
  title: {
    fontWeight: 'bold',
    color: colors.BLACK,
    marginBottom: 10,
  },
  bankImage: {
    resizeMode: 'contain',
    height: 20,
    width: 100,
  },
  accountText: {
    fontSize: 16,
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
    paddingVertical: 20,
    justifyContent: 'space-between',
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

  // modal
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
  },
  closeButton: {
    backgroundColor: colors.GREEN_300,
    borderRadius: 5,
  },
  closeButtonText: {
    fontWeight: 'bold',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
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
  listContainer: {
    backgroundColor: colors.LIGHTGRAY,
    borderRadius: 8,
    flex: 1,
    overflow: 'scroll',
  },
});

export default PayHomeScreen;
