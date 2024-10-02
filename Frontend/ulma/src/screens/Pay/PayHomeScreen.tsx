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
import {ScrollView} from 'react-native-gesture-handler';
import {payNavigations} from '@/constants/navigations';
import Toast from 'react-native-toast-message';
import usePayStore from '@/store/usePayStore';

function PayHomeScreen() {
  const {accessToken} = useAuthStore();
  const [modalVisible, setModalVisible] = useState(false);
  const {accountNumber, balance, bankCode, getAccountInfo, makeAccount} =
    usePayStore();

  useEffect(() => {
    getAccountInfo();
  }, [getAccountInfo]);

  useEffect(() => {
    console.log('계좌번호가 업데이트되었습니다:', accountNumber);
  }, [accountNumber]);

  const handleCreateAccount = async () => {
    try {
      await makeAccount();
    } catch (error) {
      console.error('계좌 생성 중 에러:', error);
    }
  };

  const bankImages = {
    하나은행: require('../../assets/Pay/banks/하나은행.png'),
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.boxContainer}>
        <Text style={styles.title}>페이머니</Text>
        {balance ? (
          <>
            <Image source={bankImages[bankCode]} style={styles.bankImage} />
            <Text style={styles.accountText}>{accountNumber}</Text>
            <Text style={styles.balance}>{balance}원</Text>
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
          <View style={styles.button}>
            <Image
              source={require('@/assets/Pay/menu/accountInfo.png')}
              style={styles.buttonImage}
            />
            <Text>계좌 정보</Text>
          </View>
          <View style={styles.button}>
            <Image
              source={require('@/assets/Pay/menu/accountEdit.png')}
              style={styles.buttonImage}
            />
            <Text>계좌 수정</Text>
          </View>
          <View style={styles.button}>
            <Image
              source={require('@/assets/Pay/menu/accountDel.png')}
              style={styles.buttonImage}
            />
            <Text>계좌 삭제</Text>
          </View>
          <View style={styles.button}>
            <Image
              source={require('@/assets/Pay/menu/sendMoney.png')}
              style={styles.buttonImage}
            />
            <Text>송금하기</Text>
          </View>
          <View style={styles.button}>
            <Image
              source={require('@/assets/Pay/menu/chargePay.png')}
              style={styles.buttonImage}
            />
            <Text>Pay 충전</Text>
          </View>
        </View>
      </View>
      <View style={styles.boxContainer}>
        <Text style={styles.title}>Pay 이력 전체보기</Text>
        <View style={styles.historyContainer}>
          <Text>내역 1</Text>
          <Text>내역 1</Text>
          <Text>내역 1</Text>
          <Text>내역 1</Text>
          <Text>내역 1</Text>
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
                  handleCreateAccount;
                  setModalVisible(false);
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
  historyContainer: {},

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
});

export default PayHomeScreen;
