// FriendsearchScreen
import CustomButton from '@/components/common/CustomButton';
import InputField from '@/components/common/InputField';
import TitleTextField from '@/components/common/TitleTextField';
import {colors} from '@/constants';
import React, {useState} from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';

interface Person {
  id: string;
  name: string;
  affiliation: string;
  transactions: {description: string; date: string}[];
}

const FriendsearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('이유찬');
  const [selectedPersonIds, setSelectedPersonIds] = useState<string[]>([]);

  const peopleData: Person[] = [
    {
      id: '1',
      name: '이유찬',
      affiliation: 'SSAFY',
      transactions: [
        {description: '친구 결혼식', date: '2020-01-01'},
        {description: '친구 생일 파티', date: '2020-01-01'},
      ],
    },
    {
      id: '2',
      name: '이유찬',
      affiliation: '싸피대학교',
      transactions: [],
    },
    // 다른 데이터 추가 가능
  ];

  const handlePersonPress = (personId: string) => {
    if (selectedPersonIds.includes(personId)) {
      // 이미 선택된 경우 선택 해제
      setSelectedPersonIds(selectedPersonIds.filter(id => id !== personId));
    } else {
      // 선택되지 않은 경우 배열에 추가
      setSelectedPersonIds([...selectedPersonIds, personId]);
    }
  };

  const filteredPeople = peopleData.filter(person =>
    person.name.includes(searchQuery),
  );

  const renderTransactionItem = ({
    item,
  }: {
    item: {description: string; date: string};
  }) => (
    <View style={styles.transactionItem}>
      <Text style={styles.transactionDescription}>{item.description}</Text>
      <Text style={styles.transactionDate}>{item.date}</Text>
    </View>
  );

  const renderPersonItem = ({item}: {item: Person}) => (
    <View>
      <TouchableOpacity
        onPress={() => handlePersonPress(item.id)}
        style={styles.itemContainer}>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
          <Text style={styles.friendName}>{item.name}</Text>
          <Text>{item.affiliation}</Text>
        </View>
        <Icon
          name={
            selectedPersonIds.includes(item.id) ? 'chevron-up' : 'chevron-down'
          }
          size={24}
          color={colors.BLACK}
        />
      </TouchableOpacity>

      {selectedPersonIds.includes(item.id) && (
        <View style={styles.partyList}>
          {item.transactions.length > 0 ? (
            <FlatList
              data={item.transactions}
              renderItem={renderTransactionItem}
              keyExtractor={(_, index) => index.toString()}
            />
          ) : (
            <Text>함께 참여한 경조사가 없어요 😢</Text>
          )}
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.cardContainer}>
        <TitleTextField frontLabel="이름을 확인해주세요." />
        <InputField
          placeholder="이름"
          value={searchQuery}
          onChangeText={setSearchQuery} // 입력된 값이 상태로 반영됨
        />

        <Text style={styles.subheader}>혹시 이 사람 아닌가요?</Text>
        <FlatList
          data={filteredPeople}
          renderItem={renderPersonItem}
          keyExtractor={item => item.id}
          style={styles.peopleList}
        />

        <CustomButton
          label="확인"
          variant="outlined"
          onPress={() => console.log('확인 버튼 누름')}
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
    paddingTop: 20,
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
    marginVertical: 10,
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
    color: '#999',
  },
});

export default FriendsearchScreen;
