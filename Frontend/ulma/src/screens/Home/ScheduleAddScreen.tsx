import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import CheckBox from '@react-native-community/checkbox';
import { useNavigation, useRoute } from '@react-navigation/native';
import axiosInstance from '@/api/axios';
import { homeNavigations } from '@/constants/navigations';

const ScheduleAddScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [selectedUser, setSelectedUser] = useState(null);  // 지인 선택 상태
  const [name, setName] = useState('');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [paidAmount, setPaidAmount] = useState('');
  const [isPaidUndefined, setIsPaidUndefined] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    if (route.params?.selectedUser && selectedUser !== route.params.selectedUser) {
      setSelectedUser(route.params.selectedUser);
    }
  }, [route.params, selectedUser]);
  

  // 날짜 변경 핸들러
  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  // 시간 변경 핸들러
  const onTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setShowTimePicker(false);
    setTime(currentTime);
  };

  // 세자리마다 콤마 넣기
  const formatNumberWithCommas = (number) => {
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // 금액 입력 시 콤마 포맷 적용
  const handlePaidAmountChange = (text) => {
    const cleaned = text.replace(/,/g, ''); // 기존 콤마 제거
    const formatted = formatNumberWithCommas(cleaned); // 새롭게 포맷
    setPaidAmount(formatted);
  };

  // POST 요청 함수
  const addSchedule = async () => {
    if (!selectedUser || !name || (!paidAmount && !isPaidUndefined)) {
      Alert.alert('모든 필드를 입력해주세요.');
      return;
    }

    try {
      // 날짜와 시간을 결합
      const combinedDateTime = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        time.getHours(),
        time.getMinutes(),
      );

      const response = await axiosInstance.post('/schedule', {
        guestId: selectedUser.guestId,  // 선택된 지인의 ID 사용
        date: combinedDateTime.toISOString(),
        paidAmount: isPaidUndefined ? 0 : -Math.abs(parseInt(paidAmount.replace(/,/g, ''))),
        name,
      });

      Alert.alert('경조사가 추가되었습니다.');
      navigation.goBack();
    } catch (error) {
      console.error('경조사 추가 실패:', error);
      Alert.alert('경조사 추가에 실패했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <Button
        title={selectedUser ? `선택된 지인: ${selectedUser.name}` : "지인 선택"}
        onPress={() => navigation.navigate(homeNavigations.SELECT_FRIEND)}
      />
      <TextInput
        style={styles.memoInput}
        placeholder="경조사 이름"
        value={name}
        onChangeText={setName}
        multiline
      />

      {/* 날짜 선택 */}
      <Button title="날짜 선택" onPress={() => setShowDatePicker(true)} />
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}
      <Text>선택된 날짜: {date.toLocaleDateString()}</Text>

      {/* 시간 선택 */}
      <Button title="시간 선택" onPress={() => setShowTimePicker(true)} />
      {showTimePicker && (
        <DateTimePicker
          value={time}
          mode="time"
          display="default"
          onChange={onTimeChange}
        />
      )}
      <Text>선택된 시간: {time.toLocaleTimeString()}</Text>

      <View style={styles.checkboxContainer}>
        <TextInput
          style={[styles.input, isPaidUndefined && styles.disabledInput]}
          placeholder="지불 금액"
          value={paidAmount}
          onChangeText={handlePaidAmountChange}
          keyboardType="numeric"
          editable={!isPaidUndefined}
        />
        <View style={styles.checkboxRow}>
          <CheckBox
            value={isPaidUndefined}
            onValueChange={setIsPaidUndefined}
          />
          <Text>미정</Text>
        </View>
      </View>

      <Button title="추가" onPress={addSchedule} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  memoInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    height: 100,
    textAlignVertical: 'top',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  disabledInput: {
    backgroundColor: '#f0f0f0',
  },
});

export default ScheduleAddScreen;
