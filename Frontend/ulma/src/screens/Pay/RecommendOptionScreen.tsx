import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const RecommendationScreen: React.FC = () => {
  const navigation = useNavigation();

  // 네비게이션 이동을 처리하는 함수
  const handleNavigation = (destination: string) => {
    // 실제 내비게이션 경로 설정
    navigation.navigate(destination);
  };

  return (
    <View style={styles.container}>
      {/* 첫 번째 옵션: 유사한 사용자에게 추천받기 */}
      <TouchableOpacity
        style={styles.optionContainer}
        onPress={() => handleNavigation('SimilarUsersScreen')} // 페이지 경로 설정
      >
        <View style={styles.icon}>
          {/* 여기에 첫 번째 아이콘을 추가할 수 있습니다 */}
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>유사한 사용자에게 추천받기</Text>
          <Text style={styles.description}>
            {'\n'} 나와 비슷한 사용자들은 이 금액을 보냈어요.
            {'\n'}
          </Text>
        </View>
        <Text style={styles.arrow}>{'>'}</Text>
      </TouchableOpacity>

      {/* 두 번째 옵션: AI에게 추천받기 */}
      <TouchableOpacity
        style={styles.optionContainer}
        onPress={() => handleNavigation('AIRecommendationScreen')} // 페이지 경로 설정
      >
        <View style={styles.icon}>
          {/* 여기에 두 번째 아이콘을 추가할 수 있습니다 */}
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>AI에게 추천받기</Text>
          <Text style={styles.description}>
            AI 생각에는 이 금액이 적절해요.
          </Text>
        </View>
        <Text style={styles.arrow}>{'>'}</Text>
      </TouchableOpacity>
    </View>
  );
};

// 스타일 정의
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end', // 화면 하단에 배치
    backgroundColor: '#333', // 상단의 어두운 배경색
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fff', // 옵션의 배경색
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: 20,
    backgroundColor: '#f5f5f5', // 아이콘 배경색
    borderRadius: 20, // 둥근 모서리
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  arrow: {
    fontSize: 18,
    color: '#666',
  },
});

export default RecommendationScreen;
