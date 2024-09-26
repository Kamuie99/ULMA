import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert, // 로그아웃 확인창을 띄우기 위한 Alert import
} from 'react-native';
import { settingNavigations } from '@/constants/navigations';
import { payNavigations } from '@/constants/navigations';
import Icon from 'react-native-vector-icons/Ionicons';
import useAuthStore from '@/store/useAuthStore';

interface SettingHomeScreenProps {
  navigation: any; // 실제 프로젝트에서는 더 구체적인 타입을 사용해야 합니다
}

function SettingHomeScreen({ navigation }: SettingHomeScreenProps) {
  const { logout, userInfo } = useAuthStore();
  // fetchUserInfo
  
  // useEffect(() => {
  //   fetchUserInfo();
  // }, []);

  // 로그아웃을 확인하는 함수
  const handleLogout = () => {
    Alert.alert(
      '로그아웃 하시겠습니까?',
      '',
      [
        { text: '아니오', style: 'cancel' },
        {
          text: '예',
          onPress: async () => {
            await logout(); // 로그아웃 실행
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.userInfo}>
        <View>
          <Text style={styles.userName}>{userInfo?.name || '사용자'}</Text>
          <Text style={styles.userEmail}>{userInfo?.email || '이메일 없음'}</Text>
        </View>
        <View style={styles.userInfoRight}>
          <TouchableOpacity onPress={handleLogout}>
            <Text style={styles.logoutText}>로그아웃</Text>
          </TouchableOpacity>
          <Icon name="chevron-forward" size={24} color="#000" />
        </View>
      </View>

      <View style={styles.accountInfoBox}>
        <Text style={styles.accountInfoTitle}>계좌 정보</Text>
        <Text style={styles.accountNumber}>싸피은행 000-1111-00-1111</Text>
        <Text style={styles.accountBalance}>잔액: 54,000 원</Text>
      </View>

      <Text style={styles.sectionTitle}>계좌 관리</Text>

      <TouchableOpacity style={styles.option}>
        <Text style={styles.optionText}>연결 계좌 변경</Text>
        <Icon name="chevron-forward" size={24} color="#000" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.option}
        onPress={() =>
          navigation.navigate('Pay', { screen: payNavigations.PAY_RECHARGE })
        }>
        <Text style={styles.optionText}>Pay 충전하기</Text>
        <Icon name="chevron-forward" size={24} color="#000" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.option}
        onPress={() => navigation.navigate(payNavigations.PAY_LIST)}>
        <Text style={styles.optionText}>Pay 이력보기</Text>
        <Icon name="chevron-forward" size={24} color="#000" />
      </TouchableOpacity>

      <Text style={[styles.sectionTitle, styles.contactManagement]}>
        지인 관리
      </Text>

      <TouchableOpacity style={styles.option}>
        <Text style={styles.optionText}>지인 목록 보기</Text>
        <Icon name="chevron-forward" size={24} color="#000" />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  userInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  userInfoRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  logoutText: {
    fontSize: 14,
    color: '#ff0000', // 로그아웃 텍스트의 색상 (빨간색)
    marginRight: 10, // 텍스트와 아이콘 사이 간격
  },
  accountInfoBox: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 15,
    marginBottom: 30,
  },
  accountInfoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  accountNumber: {
    fontSize: 14,
    marginBottom: 5,
  },
  accountBalance: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  optionText: {
    fontSize: 16,
  },
  contactManagement: {
    marginTop: 30,
  },
});

export default SettingHomeScreen;
