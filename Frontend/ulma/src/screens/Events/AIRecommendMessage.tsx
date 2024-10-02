import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import axiosInstance from '@/api/axios'; // axiosInstance 불러오기
import {AxiosError} from 'axios';

const AIRecommendMessage = () => {
  const [messages, setMessages] = useState([
    {sender: 'bot', text: '어떤 일정이 예정되어 있으신가요?'},
  ]);
  const [input, setInput] = useState('');
  const [step, setStep] = useState(1);
  const [eventType, setEventType] = useState('');
  const [friendLevel, setFriendLevel] = useState('');

  // 사용자 입력을 처리하는 함수
  const handleSendMessage = async () => {
    if (input.trim() === '') return;

    // 입력된 내용을 메시지에 추가
    setMessages([...messages, {sender: 'user', text: input}]);

    if (step === 1) {
      // 첫 번째 질문에 대한 답변 처리
      setEventType(input);
      setMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: '그 사람과의 친밀도는 얼마 정도 되나요? (1~10점)',
        },
      ]);
      setStep(2); // 두 번째 단계로 이동
    } else if (step === 2) {
      // 두 번째 질문에 대한 답변 처리
      setFriendLevel(input);
      setMessages(prev => [
        ...prev,
        {sender: 'bot', text: 'AI 추천 메시지입니다.'},
      ]);

      // AI 추천 메시지 요청
      const aiMessages = await getAIRecommendMessage(eventType, input);

      // 응답 메시지가 배열이라면 각각을 처리하여 출력
      if (Array.isArray(aiMessages)) {
        aiMessages.forEach((message: string) => {
          setMessages(prev => [...prev, {sender: 'bot', text: message}]);
        });
      } else {
        // 배열이 아닌 경우 직접 처리
        setMessages(prev => [...prev, {sender: 'bot', text: aiMessages}]);
      }
      setStep(3); // 마지막 단계
    }

    // 입력 필드를 초기화
    setInput('');
  };

  // API 호출 함수
  const getAIRecommendMessage = async (
    eventType: string,
    friendLevel: string,
  ) => {
    try {
      const response = await axiosInstance.post(
        '/events/ai/recommend/message',
        {
          gptQuotes: `${eventType}이 예정되어있고`,
          friendLevel: `1~10점 중 ${friendLevel} 정도로 친해`,
        },
      );
      // 서버 응답을 배열 또는 객체 형태로 반환
      console.log('서버 응답:', response.data);
      return response.data.messages || response.data; // 메시지 배열 또는 데이터 반환
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error('Axios error occurred:', error.response?.data); // Axios 오류 처리
      } else {
        console.error('Unknown error:', error); // 알 수 없는 오류 처리
      }
      return ['AI 메시지를 가져오는 데 문제가 발생했습니다.'];
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.chatBox}>
        {messages.map((message, index) => (
          <View
            key={index}
            style={[
              styles.message,
              message.sender === 'user'
                ? styles.userMessage
                : styles.botMessage,
            ]}>
            <Text style={styles.messageText}>{message.text}</Text>
          </View>
        ))}
      </ScrollView>

      {/* 입력 영역 */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="메시지를 입력하세요..."
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Text style={styles.sendButtonText}>전송</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  chatBox: {
    flex: 1,
    padding: 16,
  },
  message: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    maxWidth: '70%',
  },
  userMessage: {
    backgroundColor: '#DCF8C6',
    alignSelf: 'flex-end',
  },
  botMessage: {
    backgroundColor: '#E5E5EA',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    fontSize: 16,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#00C77F',
    padding: 10,
    borderRadius: 20,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default AIRecommendMessage;
