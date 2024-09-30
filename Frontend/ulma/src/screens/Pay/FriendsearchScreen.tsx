// FriendsearchScreen
import axiosInstance from '@/api/axios';
import CustomButton from '@/components/common/CustomButton';
import InputField from '@/components/common/InputField';
import TitleTextField from '@/components/common/TitleTextField';
import {colors} from '@/constants';
import {payNavigations} from '@/constants/navigations';
import {payStackParamList} from '@/navigations/stack/PayStackNavigator';
import useAuthStore from '@/store/useAuthStore';
import {useNavigation} from '@react-navigation/native';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
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
  const {accessToken} = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [peopleData, setPeopleData] = useState<Person[]>([]); // 빈 배열로 초기화
  const [selectedPeople, setSelectedPeople] = useState<Person[]>([]); // selectedPersonIds 대신 selectedPeople로 변경
  const navigation = useNavigation<InputAmountScreenNavigationProp>();

  // 처음에 데이터를 가져오는 useEffect
  useEffect(() => {
    const fetchPeopleData = async () => {
      try {
        const response = await axiosInstance.get('/participant', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        // 응답에서 각 사람의 transactions를 별도 요청으로 가져옴
        const peopleWithTransactions = await Promise.all(
          response.data.data.map(async (person: Person) => {
            const transactionsResponse = await axiosInstance.get(
              `/participant/${person.guestId}`,
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              },
            );
            const newTransactions = transactionsResponse.data.data.map(
              (item: any) => ({
                description: item.eventName,
                date: item.date.slice(0, 10),
              }),
            );
            return {...person, transactions: newTransactions}; // transactions 추가
          }),
        );

        setPeopleData(peopleWithTransactions); // 상태에 저장
      } catch (error) {
        console.error('Error fetching people data:', error);
        setPeopleData([]); // 에러 발생 시 빈 배열로 설정
      }
    };

    fetchPeopleData();
  }, [accessToken]); // accessToken이 변경될 때만 fetch

  // 사용자가 항목을 클릭했을 때 처리
  const handlePersonPress = (person: Person) => {
    if (selectedPeople.includes(person)) {
      // 이미 선택된 경우 선택 해제
      setSelectedPeople(
        selectedPeople.filter(p => p.guestId !== person.guestId),
      );
    } else {
      // 선택되지 않은 경우 배열에 추가
      setSelectedPeople([...selectedPeople, person]);
    }
  };

  // 검색어에 따라 필터링된 데이터
  const filteredPeople = (peopleData || []).filter((person: Person) =>
    person.name.includes(searchQuery),
  );

  const renderTransactionItem = ({
    item,
  }: {
    item: {description: string; date: string};
  }) => (
    <TouchableOpacity style={styles.transactionItem}>
      <Text style={styles.transactionDescription}>{item.description}</Text>
      <Text style={styles.transactionDate}>{item.date}</Text>
    </TouchableOpacity>
  );

  // 리스트에서 사람을 렌더링하는 함수
  const renderPersonItem = ({item}: {item: Person}) => (
    <View>
      <TouchableOpacity
        onPress={() => handlePersonPress(item)} // person 객체를 전달
        style={styles.itemContainer}>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
          <Text style={styles.friendName}>{item.name}</Text>
          <Text>{item.category}</Text>
        </View>
        <Icon
          name={
            selectedPeople.includes(item) // selectedPeople에 해당 person이 있는지 확인
              ? 'chevron-up'
              : 'chevron-down'
          }
          size={24}
          color={colors.BLACK}
        />
      </TouchableOpacity>

      {selectedPeople.includes(item) && (
        <View style={styles.partyList}>
          {item.transactions.length > 0 ? (
            <FlatList
              data={item.transactions}
              renderItem={renderTransactionItem}
              keyExtractor={(_, index) => index.toString()}
            />
          ) : (
            <Text style={styles.transactionItem}>
              함께 참여한 경조사가 없어요 😢
            </Text>
          )}
          <TouchableOpacity
            onPress={() =>
              navigation.navigate(payNavigations.INPUT_AMOUNT, {
                guestId: item.guestId,
              })
            }>
            <Text>선택</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.cardContainer}>
        <View style={{paddingHorizontal: 10, gap: 40}}>
          <TitleTextField frontLabel="이름을 확인해주세요." />
          <InputField
            placeholder="이름"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <ScrollView style={{paddingHorizontal: 10, marginBottom: 100}}>
          {peopleData.length > 0 && (
            <Text style={styles.subheader}>혹시 이 사람 아닌가요?</Text>
          )}
          <FlatList
            data={filteredPeople}
            renderItem={renderPersonItem}
            style={styles.peopleList}
          />
        </ScrollView>

        <CustomButton
          label="확인"
          variant="outlined"
          onPress={() => console.log('hi')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.LIGHTGRAY,
  },
  cardContainer: {
    flex: 1,
    backgroundColor: colors.WHITE,
    margin: 20,
    paddingTop: 40,
    borderRadius: 15,
    borderColor: colors.GRAY_300,
    borderWidth: 1,
    shadowColor: colors.BLACK,
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 4,
  },
  subheader: {
    fontSize: 14,
    marginTop: 10,
    marginHorizontal: 20,
  },
  friendName: {
    fontSize: 16,
    color: colors.BLACK,
    marginVertical: 10,
    fontWeight: 'bold',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  partyList: {
    backgroundColor: colors.LIGHTGRAY,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  partyItem: {
    color: colors.BLACK,
  },
  peopleList: {
    marginHorizontal: 20,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  transactionDescription: {
    fontSize: 14,
  },
  transactionDate: {
    fontSize: 14,
    color: colors.GRAY_700,
  },
});

export default FriendsearchScreen;
