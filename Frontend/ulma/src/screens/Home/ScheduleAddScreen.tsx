import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Text, Alert, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import CheckBox from '@react-native-community/checkbox';
import { useNavigation, useRoute } from '@react-navigation/native';
import axiosInstance from '@/api/axios';
import { homeNavigations } from '@/constants/navigations';
import { colors } from '@/constants'; // Assuming you have colors defined

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

  const formatNumberWithCommas = (number) => {
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handlePaidAmountChange = (text) => {
    const cleaned = text.replace(/,/g, ''); // 기존 콤마 제거
    const formatted = formatNumberWithCommas(cleaned); // 새롭게 포맷
    setPaidAmount(formatted);
  };

  const addSchedule = async () => {
    if (!selectedUser || !name || (!paidAmount && !isPaidUndefined)) {
      Alert.alert('모든 필드를 입력해주세요.');
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
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>지인 선택</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate(homeNavigations.SELECT_FRIEND)}
        >
          <Text style={styles.buttonText}>
            {selectedUser ? `선택된 지인: ${selectedUser.name}` : '지인 선택'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>경조사 이름</Text>
        <TextInput
          style={styles.memoInput}
          placeholder="간단한 설명을 적어주세요"
          value={name}
          onChangeText={setName}
          multiline
        />
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>날짜 선택</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.buttonText}>날짜 선택</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}
        <Text>선택된 날짜: {date.getFullYear()}/{(date.getMonth() + 1).toString().padStart(2, '0')}/{date.getDate().toString().padStart(2, '0')}</Text>
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>시간 선택</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setShowTimePicker(true)}
        >
          <Text style={styles.buttonText}>시간 선택</Text>
        </TouchableOpacity>
        {showTimePicker && (
          <DateTimePicker
            value={time}
            mode="time"
            display="default"
            onChange={onTimeChange}
          />
        )}
        <Text>선택된 시간: {time.toLocaleTimeString()}</Text>
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>지불 금액</Text>
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
      </View>

      <TouchableOpacity style={styles.button} onPress={addSchedule}>
        <Text style={styles.buttonText}>추가</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.WHITE,
  },
  fieldContainer: {
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    color: colors.GRAY_700,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.GRAY_300,
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    color: colors.BLACK,
    marginBottom: 10,
    width: '90%', // Increased width for input fields
  },
  memoInput: {
    borderWidth: 1,
    borderColor: colors.GRAY_300,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    height: 100,
    textAlignVertical: 'top',
    fontSize: 16,
    color: colors.BLACK,
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
  button: {
    backgroundColor: colors.GREEN_700,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.WHITE,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ScheduleAddScreen;
