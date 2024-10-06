import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import axiosInstance from '@/api/axios';
import {AxiosError} from 'axios';
import {homeNavigations} from '@/constants/navigations';
import {homeStackParamList} from '@/navigations/stack/HomeStackNavigator'; // homeStackParamList import

const AIRecommendMessage = () => {
  // 네비게이션 타입 명시
  const navigation = useNavigation<NavigationProp<homeStackParamList>>();
  const [messages, setMessages] = useState([
    {sender: 'bot', text: '어떤 일정이 예정되어 있으신가요?'},
  ]);
  const [input, setInput] = useState('');
  const [step, setStep] = useState(1);
  const [eventType, setEventType] = useState('');
  const [friendLevel, setFriendLevel] = useState('');
  const [showButtons, setShowButtons] = useState(false);

  const handleSendMessage = async () => {
    if (input.trim() === '') return;

    setMessages([...messages, {sender: 'user', text: input}]);

    if (step === 1) {
      setEventType(input);
      setMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: '그 사람과의 친밀도는 얼마 정도 되나요? (1~10점)',
        },
      ]);
      setStep(2);
    } else if (step === 2) {
      setFriendLevel(input);
      setMessages(prev => [
        ...prev,
        {sender: 'bot', text: 'AI 추천 메시지입니다.'},
      ]);

      const aiMessages = await getAIRecommendMessage(eventType, input);

      if (Array.isArray(aiMessages)) {
        aiMessages.forEach((message: string) => {
          setMessages(prev => [...prev, {sender: 'bot', text: message}]);
        });
      } else {
        setMessages(prev => [...prev, {sender: 'bot', text: aiMessages}]);
      }

      setStep(3);
      setShowButtons(true);
    }

    setInput('');
  };

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
      console.log('서버 응답:', response.data);
      return response.data.messages || response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error('Axios error occurred:', error.response?.data);
      } else {
        console.error('Unknown error:', error);
      }
      return ['AI 메시지를 가져오는 데 문제가 발생했습니다.'];
    }
  };

  const resetChat = () => {
    setMessages([{sender: 'bot', text: '어떤 일정이 예정되어 있으신가요?'}]);
    setStep(1);
    setEventType('');
    setFriendLevel('');
    setShowButtons(false);
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

        {showButtons && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate(homeNavigations.LANDING)}>
              <Text style={styles.actionButtonText}>홈페이지로 돌아가기</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={resetChat}>
              <Text style={styles.actionButtonText}>다시 질문하기</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  actionButton: {
    backgroundColor: '#00C77F',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default AIRecommendMessage;
