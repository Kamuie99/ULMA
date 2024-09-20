//친밀도 이모지 선택 페이지
import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Button,
} from 'react-native';

const EventScreen = () => {
  // 선택된 이모지 인덱스를 관리
  const [selectedEmoji, setSelectedEmoji] = useState<number | null>(null);

  // 이모지 데이터
  const emojis = [
    {
      id: 1,
      src: 'https://via.placeholder.com/51x51',
      label: '가까운 사이는 아니에요',
    },
    {
      id: 2,
      src: 'https://via.placeholder.com/51x51',
      label: '',
    },
    {
      id: 3,
      src: 'https://via.placeholder.com/51x51',
      label: '매우 가까워요',
    },
  ];

  // 이모지 선택 처리
  const handleEmojiSelect = (id: number) => {
    setSelectedEmoji(id);
  };

  return (
    <View style={styles.container}>
      {/* AI 추천 금액 */}
      <Text style={styles.title}>AI 추천 금액</Text>

      {/* 사용자와의 관계 질문 */}
      <Text style={styles.question}>
        <Text style={styles.highlight}>이유찬</Text>
        님과 {'\n'} 얼마나 가까운 사이인가요?
      </Text>

      {/* 이모지 선택 */}
      <View style={styles.emojiContainer}>
        {emojis.map(emoji => (
          <TouchableOpacity
            key={emoji.id}
            onPress={() => handleEmojiSelect(emoji.id)}
            style={[
              styles.emojiWrapper,
              selectedEmoji === emoji.id && styles.selectedEmoji, // 선택된 이모지의 스타일 변경
            ]}>
            <Image source={{uri: emoji.src}} style={styles.emojiImage} />
            <Text style={styles.emojiLabel}>{emoji.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 확인 버튼 */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => console.log('확인 버튼 눌림')}>
        <Text style={styles.buttonText}>확인</Text>
      </TouchableOpacity>
    </View>
  );
};

// 스타일 정의
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 14,
    fontFamily: 'SamsungGothicCondensed',
    fontWeight: '400',
    color: 'black',
    textAlign: 'center',
    marginBottom: 20,
  },
  question: {
    fontSize: 22,
    fontFamily: 'SamsungGothicCondensed',
    fontWeight: '400',
    color: 'black',
    textAlign: 'center',
    marginBottom: 30,
  },
  highlight: {
    color: '#3FC89E',
  },
  emojiContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 50,
  },
  emojiWrapper: {
    alignItems: 'center',
  },
  emojiImage: {
    width: 51,
    height: 51,
  },
  emojiLabel: {
    fontSize: 12,
    fontFamily: 'SamsungGothicCondensed',
    fontWeight: '400',
    color: '#A7A7A7',
    marginTop: 8,
  },
  selectedEmoji: {
    opacity: 1, // 선택되면 진해지도록
  },
  button: {
    backgroundColor: '#C2EADF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#3FC89E',
    fontSize: 14,
    fontFamily: 'SamsungGothicCondensed',
    fontWeight: '400',
  },
});

export default EventScreen;
