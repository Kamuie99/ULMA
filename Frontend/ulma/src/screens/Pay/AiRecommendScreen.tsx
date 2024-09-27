import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import axiosInstance from '@/api/axios'; // axiosInstance를 import하여 baseURL이 설정된 axios 사용

// 메시지의 타입을 정의합니다.
interface Message {
  id: string;
  text: string;
  type: 'user' | 'bot';
  options?: JSX.Element; // 옵션 버튼을 위한 추가 필드
}

function AiRecommendScreen() {
  const [step, setStep] = useState(1); // 현재 질문 단계
  const [event, setEvent] = useState(''); // 이벤트 종류
  const [relationship, setRelationship] = useState(''); // 관계
  const [ageGroup, setAgeGroup] = useState(''); // 연령대
  const [income, setIncome] = useState(''); // 사용자 수입
  const [messages, setMessages] = useState<Message[]>([]); // 메시지 목록을 Message 타입으로 설정
  const [inputText, setInputText] = useState(''); // 사용자의 입력값

  // 컴포넌트가 처음 렌더링될 때 첫 질문 추가
  useEffect(() => {
    const initialMessage: Message = {
      id: '0',
      text: '어떤 이벤트가 예정되어 있습니까?', // 첫 번째 봇의 질문
      type: 'bot',
    };
    setMessages([initialMessage]); // 처음 메시지 목록에 봇의 첫 질문 추가
  }, []); // 빈 배열로 설정하여 컴포넌트 마운트 시 한 번만 실행

  const handleSend = () => {
    if (inputText.trim() === '') return; // 빈 값은 처리하지 않음

    // 사용자의 입력을 메시지 리스트에 추가
    const userMessage: Message = {
      id: messages.length.toString(),
      text: inputText,
      type: 'user', // 사용자 메시지
    };

    setMessages([...messages, userMessage]);
    nextStep(inputText); // 사용자 입력을 다음 단계로 전달
    setInputText(''); // 입력값 초기화
  };

  const nextStep = async (userResponse: string) => {
    if (step === 1) {
      setEvent(userResponse);
      const botMessage: Message = {
        id: messages.length.toString(),
        text: '그 사람과의 관계가 어떠십니까?',
        type: 'bot',
      };
      setMessages(prevMessages => [...prevMessages, botMessage]);
      setStep(2);
    } else if (step === 2) {
      setRelationship(userResponse);
      const botMessage: Message = {
        id: messages.length.toString(),
        text: '연령대가 어떻게 되십니까?',
        type: 'bot',
      };
      setMessages(prevMessages => [...prevMessages, botMessage]);
      setStep(3);
    } else if (step === 3) {
      setAgeGroup(userResponse);
      const botMessage: Message = {
        id: messages.length.toString(),
        text: '연소득이 어떻게 되십니까?',
        type: 'bot',
      };
      setMessages(prevMessages => [...prevMessages, botMessage]);
      setStep(4);
    } else if (step === 4) {
      setIncome(userResponse);

      try {
        // API 호출
        const recommendation = await fetchRecommendation(
          event,
          relationship,
          ageGroup,
          userResponse,
        );
        // 추천 금액과 함께 버튼 옵션을 메시지로 추가
        const botMessage: Message = {
          id: messages.length.toString(),
          text: `추천 금액: ${recommendation}`,
          type: 'bot',
          options: (
            <View style={styles.optionsContainer}>
              <TouchableOpacity
                style={styles.optionBox}
                onPress={() => console.log('pay송금 바로가기')}>
                <Text style={styles.optionText}>pay송금 바로가기</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.optionBox}
                onPress={() => console.log('홈으로 돌아가기')}>
                <Text style={styles.optionText}>홈으로 돌아가기</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.optionBox}
                onPress={() => console.log('다시 질문하기')}>
                <Text style={styles.optionText}>다시 질문하기</Text>
              </TouchableOpacity>
            </View>
          ),
        };
        setMessages(prevMessages => [...prevMessages, botMessage]);
      } catch (error) {
        const errorMessage: Message = {
          id: messages.length.toString(),
          text: '추천 금액을 가져오는 중 오류가 발생했습니다.',
          type: 'bot',
        };
        setMessages(prevMessages => [...prevMessages, errorMessage]);
      }
    }
  };

  // API 호출 함수 구현
  async function fetchRecommendation(
    event: string,
    relationship: string,
    ageGroup: string,
    income: string,
  ) {
    try {
      // axiosInstance를 사용하여 API 호출
      const response = await axiosInstance.post('/events/ai/recommend/money', {
        gptQuotes: `매우 ${relationship} 사이예요. ${event} ${ageGroup}, 연소득 ${income}천만원`,
      });

      // API로부터 받은 추천 금액 데이터 반환
      return response.data;
    } catch (error) {
      console.error('추천 금액을 불러오는 중 오류가 발생했습니다:', error);
      throw error; // 오류 발생 시 호출 부분에 오류를 던져서 처리
    }
  }

  const renderItem = ({item}: {item: Message}) => (
    <View
      style={[
        styles.messageBox,
        item.type === 'user' ? styles.userMessage : styles.botMessage,
      ]}>
      <Text style={styles.messageText}>{item.text}</Text>
      {item.options && item.options} {/* 옵션이 있을 경우 렌더링 */}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.chatContainer}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="답변을 입력하세요"
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.buttonText}>보내기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f2f2f2',
  },
  chatContainer: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  messageBox: {
    maxWidth: '80%',
    padding: 10,
    borderRadius: 20,
    marginBottom: 10,
  },
  userMessage: {
    backgroundColor: '#dcf8c6',
    alignSelf: 'flex-end',
  },
  botMessage: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
  },
  optionsContainer: {
    marginTop: 10,
  },
  optionBox: {
    backgroundColor: '#e6e6e6',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  optionText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#333',
  },
});

export default AiRecommendScreen;
