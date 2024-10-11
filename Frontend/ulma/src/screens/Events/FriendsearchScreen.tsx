import axiosInstance from '@/api/axios';
import CustomButton from '@/components/common/CustomButton';
import InputField from '@/components/common/InputField';
import TitleTextField from '@/components/common/TitleTextField';
import {colors} from '@/constants';
import {eventNavigations, payNavigations} from '@/constants/navigations';
import {payStackParamList} from '@/navigations/stack/PayStackNavigator';
import useAuthStore from '@/store/useAuthStore';
import useEventStore from '@/store/useEventStore'; // eventStore 임포트
import {useNavigation} from '@react-navigation/native';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Entypo';

interface Person {
  guestId: number;
  name: string;
  category: string;
  transactions: {description: string; date: string}[];
}

type InputAmountScreenNavigationProp = StackNavigationProp<
  payStackParamList,
  typeof payNavigations.INPUT_AMOUNT
>;

const FriendsearchScreen = () => {
  const {selectedTransactions, eventID} = useEventStore(); // 선택된 거래 내역 가져오기
  const navigation = useNavigation<InputAmountScreenNavigationProp>();

  // 선택된 거래 내역을 렌더링하는 함수
  const renderSelectedTransactionItem = ({item}: {item: any}) => (
    <View style={styles.transactionItem}>
      <Text style={styles.transactionDescription}>{item.name}</Text>
      <Text style={styles.transactionAmount}>
        {Number(item.amount).toLocaleString()} 원
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.cardContainer}>
        <View style={{paddingHorizontal: 10, gap: 40}}>
          <TitleTextField frontLabel="거래 내역이 등록되었습니다." left={10} />
        </View>
        <ScrollView
          style={{paddingHorizontal: 10, marginBottom: 100, marginTop: 20}}>
          <FlatList
            data={selectedTransactions}
            renderItem={renderSelectedTransactionItem}
            keyExtractor={(_, index) => index.toString()}
            style={styles.peopleList}
          />
        </ScrollView>
      </View>
      <CustomButton
        label="확인"
        size="full"
        onPress={() => {
          // zustand에서 저장된 이벤트 정보를 가져옴
          const {eventID, category, name, eventTime} = useEventStore.getState();

          // 이벤트 상세 화면으로 이동
          navigation.navigate(eventNavigations.EVENT_DETAIL, {
            event_id: eventID,
            category: category,
            name: name,
            eventTime: eventTime,
          });
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
  cardContainer: {
    flex: 1,
    backgroundColor: colors.WHITE,
    margin: 20,
    paddingTop: 40,
    borderRadius: 15,
    borderColor: colors.GRAY_300,
    borderWidth: 1,
    marginBottom: 80,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  transactionDescription: {
    fontSize: 14,
  },
  transactionAmount: {
    fontSize: 14,
    color: colors.GRAY_700,
  },
  peopleList: {
    marginHorizontal: 20,
  },
});

export default FriendsearchScreen;
