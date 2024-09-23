import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity, ScrollView} from 'react-native';
import { settingNavigations } from '@/constants/navigations';
import { payNavigations } from '@/constants/navigations';
import Icon from 'react-native-vector-icons/Ionicons';

interface SettingHomeScreenProps {
  navigation: any; // 실제 프로젝트에서는 더 구체적인 타입을 사용해야 합니다
}

function SettingHomeScreen({ navigation }: SettingHomeScreenProps) {
  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity 
        style={styles.userInfo}
        onPress={() => navigation.navigate(settingNavigations.USER_DETAIL)}
      >
        <View>
          <Text style={styles.userName}>김싸피</Text>
          <Text style={styles.userEmail}>dakgoo02@naver.com</Text>
        </View>
        <Icon name="chevron-forward" size={24} color="#000" />
      </TouchableOpacity>

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
        onPress={() => navigation.navigate('Pay', { screen: payNavigations.PAY_RECHARGE })}
      >
        <Text style={styles.optionText}>Pay 충전하기</Text>
        <Icon name="chevron-forward" size={24} color="#000" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.option} onPress={() => navigation.navigate(payNavigations.SEND_RESULT)}>
        <Text style={styles.optionText}>Pay 이력보기</Text>
        <Icon name="chevron-forward" size={24} color="#000" />
      </TouchableOpacity>

      <Text style={[styles.sectionTitle, styles.contactManagement]}>지인 관리</Text>

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
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
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