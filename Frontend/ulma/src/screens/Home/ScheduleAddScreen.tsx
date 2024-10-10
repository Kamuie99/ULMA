import React, {useState, useEffect} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView, // 추가
  Platform, // 추가
  ScrollView,
  Keyboard,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import CheckBox from '@react-native-community/checkbox';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import axiosInstance from '@/api/axios';
import {homeNavigations} from '@/constants/navigations';
import {colors} from '@/constants';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomButton from '@/components/common/CustomButton';
import Toast from 'react-native-toast-message';
import useEventStore from '@/store/useEventStore';

const ScheduleAddScreen = () => {
  const navigation = useNavigation();
  const {newEventInfo, setNewEventInfo} = useEventStore();
  const route = useRoute();
  const [selectedUser, setSelectedUser] = useState(
    newEventInfo && newEventInfo.guestId && newEventInfo.name
      ? {guestId: newEventInfo.guestId, name: newEventInfo.name}
      : null,
  );
  const [name, setName] = useState('');
  const [date, setDate] = useState(
    newEventInfo?.date ? new Date(newEventInfo.date) : new Date(),
  );
  const [time, setTime] = useState(
    newEventInfo?.time ? new Date(newEventInfo.time) : new Date(),
  );
  const [paidAmount, setPaidAmount] = useState('');
  const [isPaidUndefined, setIsPaidUndefined] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [recommAmount, setRecommAmount] = useState('');

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      },
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      },
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      // newEventInfo에 있는 정보를 이용하여 컴포넌트 상태를 업데이트
      if (newEventInfo && newEventInfo.guestId && newEventInfo.name) {
        setSelectedUser({id: newEventInfo.guestId, name: newEventInfo.name});
      }

      if (newEventInfo?.date) {
        setDate(new Date(newEventInfo.date));
      }

      if (newEventInfo?.time) {
        setTime(new Date(newEventInfo.time));
      }

      // 경로 파라미터에서 선택된 사용자 정보 업데이트
      if (
        route.params?.selectedUser &&
        selectedUser !== route.params.selectedUser
      ) {
        setSelectedUser(route.params.selectedUser);
      }

      return () => {
        // 필요에 따라 클린업 로직을 추가할 수 있습니다.
      };
    }, [route.params, selectedUser, newEventInfo]), // newEventInfo를 의존성 배열에 추가
  );

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const onTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setShowTimePicker(false);
    setTime(currentTime);
  };

  const formatNumberWithCommas = number => {
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handlePaidAmountChange = text => {
    const cleaned = text.replace(/,/g, '');
    const formatted = formatNumberWithCommas(cleaned);
    setPaidAmount(formatted);
  };

  const addSchedule = async () => {
    if (!selectedUser || !name || (!paidAmount && !isPaidUndefined)) {
      Toast.show({
        text1: '모든 필드를 입력해주세요!',
        type: 'error',
      });
      return;
    }

    try {
      const combinedDateTime = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        time.getHours(),
        time.getMinutes(),
      );

      const response = await axiosInstance.post('/schedule', {
        guestId: selectedUser.guestId,
        date: combinedDateTime.toISOString(),
        paidAmount: isPaidUndefined
          ? 0
          : -Math.abs(parseInt(paidAmount.replace(/,/g, ''))),
        name,
      });
      setNewEventInfo(null, null, null, null);
      navigation.goBack();
    } catch (error) {
      console.error('경조사 추가 실패:', error);
      Toast.show({
        text1: '추가에 실패하였습니다.',
        type: 'error',
      });
    }
  };

  const handleFocus = async () => {
    let category, history;

    try {
      // 참가자 카테고리 가져오기
      const categoryResponse = await axiosInstance.get(
        `/participant/${selectedUser.guestId}`,
      );
      console.log(categoryResponse.data);
      console.log(selectedUser.guestId);
      category = categoryResponse.guestCategory;
    } catch (error) {
      console.error('참가자 카테고리 데이터 받아오기 실패:', error);
      return;
    }

    try {
      const historyResponse = await axiosInstance.get(
        `/participant/${selectedUser.guestId}`,
      );
      console.log(historyResponse.data.data);
      history = historyResponse.data.data;
    } catch (error) {
      console.error('경조사비 내역 데이터 받아오기 실패:', error);
      return;
    }

    try {
      // AI 경조사비 추천 요청
      const response = await axiosInstance.get('/events/ai/recommend/money', {
        params: {
          gptQuotes: `경조사비 추천해줘. 
          ${name} 행사가 예정되어 있어.
          그 사람과의 관계는 ${category}이고, 최근 주고 받은 경조사비 내역은 다음과 같아. ${history}`,
        },
      });

      console.log(response);
      setRecommAmount(response.data);
    } catch (error) {
      console.log(`경조사비 추천해줘. 
          ${name} 행사가 예정되어 있어.
          그 사람과의 관계는 ${category}이고, 최근 주고 받은 경조사비 내역은 다음과 같아. ${history}`);
      console.error('AI 경조사비 추천 데이터 받아오기 실패:', error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined} // iOS에서만 패딩 적용
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0} // iOS에선 약간의 오프셋을 추가해줄 수 있습니다
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>누구의 경조사 인가요?</Text>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() =>
                navigation.navigate(homeNavigations.SELECT_FRIEND)
              }>
              <Text style={styles.selectButtonText}>
                {selectedUser
                  ? `${selectedUser.name} 님의 경조사`
                  : '지인 선택'}
              </Text>
              <Icon
                name="arrow-forward-ios"
                size={20}
                color={colors.GREEN_700}
              />
            </TouchableOpacity>
          </View>

          {/* 기타 입력 필드들 */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>어떤 경조사인가요?</Text>
            <TextInput
              style={styles.input}
              placeholder="간단한 설명을 적어주세요"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.dateTimeContainer}>
            <View style={styles.dateTimeField}>
              <Text style={styles.label}>날짜</Text>
              <TouchableOpacity
                style={styles.dateTimeButton}
                onPress={() => setShowDatePicker(true)}>
                <Text style={styles.dateTimeText}>
                  {date.getFullYear()}/
                  {(date.getMonth() + 1).toString().padStart(2, '0')}/
                  {date.getDate().toString().padStart(2, '0')}
                </Text>
                <Icon name="event" size={20} color={colors.GREEN_700} />
              </TouchableOpacity>
            </View>
            <View style={styles.dateTimeField}>
              <Text style={styles.label}>시간</Text>
              <TouchableOpacity
                style={styles.dateTimeButton}
                onPress={() => setShowTimePicker(true)}>
                <Text style={styles.dateTimeText}>
                  {time.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
                <Icon name="access-time" size={20} color={colors.GREEN_700} />
              </TouchableOpacity>
            </View>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={onDateChange}
            />
          )}
          {showTimePicker && (
            <DateTimePicker
              value={time}
              mode="time"
              display="default"
              onChange={onTimeChange}
            />
          )}

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>얼마를 드렸나요?</Text>
            <View style={styles.amountContainer}>
              <TextInput
                style={[
                  styles.input,
                  styles.amountInput,
                  isPaidUndefined && styles.disabledInput,
                ]}
                placeholder="지불 금액"
                value={paidAmount}
                onChangeText={handlePaidAmountChange}
                keyboardType="numeric"
                editable={!isPaidUndefined}
                onFocus={handleFocus}
              />
              <View style={styles.checkboxContainer}>
                <CheckBox
                  value={isPaidUndefined}
                  onValueChange={setIsPaidUndefined}
                  tintColors={{true: colors.GREEN_700, false: colors.GRAY_300}}
                />
                <Text style={styles.checkboxLabel}>아직</Text>
              </View>
            </View>
            {recommAmount && (
              <Text style={styles.recomment}>
                AI 생각에는 {recommAmount} 원이 적절해보여요!
              </Text>
            )}
          </View>
        </View>

        {!isKeyboardVisible && (
          <>
            <CustomButton label="추가하기" onPress={addSchedule} posY={30} />
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.GRAY_100,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  card: {
    backgroundColor: colors.WHITE,
    borderRadius: 15,
    padding: 20,
    margin: 16,
    shadowColor: colors.BLACK,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.GRAY_700,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.GRAY_300,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.BLACK,
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.GREEN_700,
    borderRadius: 8,
    padding: 12,
  },
  selectButtonText: {
    fontSize: 16,
    color: colors.GREEN_700,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dateTimeField: {
    flex: 1,
    marginRight: 10,
  },
  dateTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.GRAY_300,
    borderRadius: 8,
    padding: 12,
  },
  dateTimeText: {
    fontSize: 16,
    color: colors.BLACK,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amountInput: {
    flex: 1,
    marginRight: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 14,
    color: colors.GRAY_700,
  },
  disabledInput: {
    backgroundColor: colors.GRAY_100,
  },
  recomment: {
    margin: 5,
    color: colors.PINK,
    fontWeight: 'bold',
  },
});

export default ScheduleAddScreen;
