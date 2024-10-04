import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import axiosInstance from '@/api/axios';
import CheckBox from '@react-native-community/checkbox';

const ScheduleAddScreen = ({ navigation }) => {
  const [guestId, setGuestId] = useState('');
  const [name, setName] = useState('');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [paidAmount, setPaidAmount] = useState('');
  const [isPaidUndefined, setIsPaidUndefined] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // 날짜 선택
  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  // 시간 선택
  const onTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setShowTimePicker(false);
    setTime(currentTime);
  };

  // POST 요청 함수
  const addSchedule = async () => {
    if (!guestId || !name || (!paidAmount && !isPaidUndefined)) {
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
        guestId: parseInt(guestId),
        date: combinedDateTime.toISOString(),
        paidAmount: isPaidUndefined ? 0 : -Math.abs(parseInt(paidAmount.replace(/,/g, ''))), // 음수 처리
        name,
      });

      Alert.alert('경조사가 추가되었습니다.');
      navigation.goBack();
    } catch (error) {
      console.error('경조사 추가 실패:', error);
      Alert.alert('경조사 추가에 실패했습니다.');
    }
  };

  // 세자리마다 콤마 넣기
  const formatNumberWithCommas = (number) => {
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handlePaidAmountChange = (text) => {
    const cleaned = text.replace(/,/g, ''); // 기존 콤마 제거
    const formatted = formatNumberWithCommas(cleaned); // 새롭게 포맷
    setPaidAmount(formatted);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="게스트 ID"
        value={guestId}
        onChangeText={setGuestId}
        keyboardType="numeric"
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
          mode="date" // 날짜 선택 모드
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
          mode="time" // 시간 선택 모드
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
