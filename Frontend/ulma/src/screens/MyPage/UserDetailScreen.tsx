import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert, // 로그아웃 확인창을 띄우기 위한 Alert import
} from 'react-native';
import useAuthStore from '@/store/useAuthStore';

interface UserDetailScreenProps {
  navigation: any; // 실제 프로젝트에서는 더 구체적인 타입을 사용해야 합니다
}

function UserDetailScreen({ navigation }: UserDetailScreenProps) {
  const { userInfo, logout, accessToken } = useAuthStore(); // useAuthStore에서 userInfo와 logout 함수 가져옴

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
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>이름</Text>
          <Text style={styles.value}>{userInfo?.name || '이름 없음'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>아이디</Text>
          <Text style={styles.value}>{userInfo?.loginId || '아이디 없음'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>이메일</Text>
          <Text style={styles.value}>{userInfo?.email || '이메일 없음'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>비밀번호 수정</Text>
          <TouchableOpacity onPress={() => navigation.navigate('ChangePassword')}>
            <Text style={styles.changePassword}>수정하기</Text>
          </TouchableOpacity>
        </View>
        {/* <View style={styles.row}>
          <Text style={styles.value}>{accessToken || '토큰 없음'}</Text>
        </View> */}
      </View>
      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>로그아웃</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: {
    fontSize: 16,
    color: '#333',
  },
  value: {
    fontSize: 16,
    color: '#666',
  },
  changePassword: {
    fontSize: 16,
    color: '#4caf50',
  },
  logoutButton: {
    marginTop: 20, // 조정해야할 수 있음
    alignSelf: 'center', // 버튼을 중앙에 위치시킴
  },
  logoutText: {
    fontSize: 14,
    // color: '#ff0000',
  },
});

export default UserDetailScreen;
