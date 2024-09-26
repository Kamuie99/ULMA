import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

interface UserDetailScreenProps {
  navigation: any; // 실제 프로젝트에서는 더 구체적인 타입을 사용해야 합니다
}

function UserDetailScreen({ navigation }: UserDetailScreenProps) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>이름</Text>
          <Text style={styles.value}>김싸피</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>이메일</Text>
          <Text style={styles.value}>kimssafy@ssafy.com</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>비밀번호</Text>
          <TouchableOpacity onPress={() => navigation.navigate('ChangePassword')}>
            <Text style={styles.changePassword}>수정하러 가기</Text>
          </TouchableOpacity>
        </View>
      </View>
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
});

export default UserDetailScreen;