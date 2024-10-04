import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import axiosInstance from '@/api/axios';
import {NavigationProp, useFocusEffect} from '@react-navigation/native';
import {payNavigations, homeNavigations} from '@/constants/navigations';

interface Message {
  id: string;
  text: string;
  type: 'user' | 'bot';
  options?: JSX.Element;
}

function AiRecommendScreen({navigation}: {navigation: NavigationProp<any>}) {
  const [step, setStep] = useState(1); // 질문 단계
  const [event, setEvent] = useState(''); // 이벤트 종류
  const [relationship, setRelationship] = useState(''); // 관계
  const [income, setIncome] = useState(''); // 연 소득
  const [userInfo, setUserInfo] = useState<{
    name: string;
    age: number;
    gender: string;
  } | null>(null); // 사용자 정보
  const [messages, setMessages] = useState<Message[]>([]); // 메시지 목록
  const [inputText, setInputText] = useState(''); // 사용자의 입력값

  // 페이지가 다시 포커스될 때 상태 초기화
  useFocusEffect(
    React.useCallback(() => {
      resetChat();
    }, []),
  );

  const resetChat = () => {
    setStep(1);
    setEvent('');
    setRelationship('');
    setIncome('');
    setUserInfo(null);
    setMessages([
      {id: '0', text: '어떤 이벤트가 예정되어 있습니까?', type: 'bot'},
    ]);
    setInputText('');
  };

  // 초기 질문 메시지
  useEffect(() => {
    const initialMessage: Message = {
      id: '0',
      text: '어떤 이벤트가 예정되어 있습니까?',
      type: 'bot',
    };
    setMessages([initialMessage]);
  }, []);

  const handleSend = () => {
    if (inputText.trim() === '') return;

    const userMessage: Message = {
      id: messages.length.toString(),
      text: inputText,
      type: 'user',
    };

    setMessages([...messages, userMessage]);
    nextStep(inputText); // 다음 단계로 넘어가기
    setInputText(''); // 입력 초기화
  };

  const nextStep = async (userResponse: string) => {
    if (step === 1) {
      setEvent(userResponse);
      addBotMessage('그 사람과의 관계가 어떠십니까? (1~10점 중)');
      setStep(2);
    } else if (step === 2) {
      setRelationship(userResponse);
      addBotMessage('연 소득은 어느 정도 되십니까?');
      setStep(3);
    } else if (step === 3) {
      setIncome(userResponse); // 연 소득 설정
      try {
        // 회원 정보 조회
        const userInfoResponse = await axiosInstance.get('/user');
        const {name, age, gender} = userInfoResponse.data;
        setUserInfo({name, age, gender});
        addBotMessage(
          `${name}님, ${age}세 (${
            gender === 'M' ? '남' : '여'
          })님의 맞춤 정보를 분석합니다.`,
        );
        setStep(4);

        // 추천 금액 받기
        const recommendation = await fetchRecommendation();
        addBotMessage(`추천 금액: ${recommendation}원`);
        showOptions(); // 옵션 버튼 보여주기
      } catch (error) {
        console.error('회원 정보를 가져오는 중 오류가 발생했습니다:', error);
        addBotMessage('회원 정보를 가져오는 중 오류가 발생했습니다.');
      }
    }
  };

  const addBotMessage = (text: string) => {
    const botMessage: Message = {
      id: messages.length.toString(),
      text,
      type: 'bot',
    };
    setMessages(prevMessages => [...prevMessages, botMessage]);
  };

  const showOptions = () => {
    const optionsMessage: Message = {
      id: messages.length.toString(),
      text: '',
      type: 'bot',
      options: (
        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={styles.optionBox}
            onPress={() => navigation.navigate(payNavigations.SENDING)}>
            <Text style={styles.optionText}>pay 송금 바로가기</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.optionBox}
            onPress={() => navigation.navigate(homeNavigations.LANDING)}>
            <Text style={styles.optionText}>홈으로 돌아가기</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionBox} onPress={resetChat}>
            <Text style={styles.optionText}>다시 질문하기</Text>
          </TouchableOpacity>
        </View>
      ),
    };
    setMessages(prevMessages => [...prevMessages, optionsMessage]);
  };

  // AI 금액 추천 API 호출
  const fetchRecommendation = async () => {
    try {
      const gptQuotes = `${userInfo?.name}님, ${userInfo?.age}세 (${
        userInfo?.gender === 'M' ? '남' : '여'
      })님, ${event} 행사, 관계 점수 ${relationship}, 연 소득 ${income}으로 맞춤 추천합니다.`;

      const response = await axiosInstance.post('/events/ai/recommend/money', {
        gptQuotes,
      });

      if (response.data && typeof response.data === 'string') {
        return response.data; // 정상적인 추천 금액 반환
      } else {
        throw new Error('추천 금액을 찾을 수 없습니다.');
      }
    } catch (error) {
      console.error('추천 금액을 불러오는 중 오류가 발생했습니다:', error);
      return '추천 금액을 찾을 수 없습니다.';
    }
  };

  const renderItem = ({item}: {item: Message}) => (
    <View
      style={[
        styles.messageBox,
        item.type === 'user' ? styles.userMessage : styles.botMessage,
      ]}>
      <Text style={styles.messageText}>{item.text}</Text>
      {item.options && item.options}
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
