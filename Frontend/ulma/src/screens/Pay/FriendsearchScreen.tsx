//FriendsearchScreen
import React, {useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Button,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; // 변경된 부분

interface Person {
  id: string;
  name: string;
  affiliation: string;
  transactions: {description: string; date: string}[];
}

const FriendsearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

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

  const filteredPeople = peopleData.filter(person =>
    person.name.includes(searchQuery),
  );

  const handlePersonSelect = (person: Person) => {
    setSelectedPerson(person);
  };

  const renderPersonItem = ({item}: {item: Person}) => (
    <TouchableOpacity
      style={styles.personItem}
      onPress={() => handlePersonSelect(item)}>
      <View style={styles.personRow}>
        <Text style={styles.personName}>{item.name}</Text>
        <Text style={styles.personAffiliation}>{item.affiliation}</Text>
        <MaterialIcons
          name={selectedPerson?.id === item.id ? 'expand-less' : 'expand-more'}
          size={24}
          color="black"
        />
      </View>
      {selectedPerson?.id === item.id &&
        selectedPerson.transactions.length > 0 && (
          <FlatList
            data={selectedPerson.transactions}
            renderItem={renderTransactionItem}
            keyExtractor={(_, index) => index.toString()}
            style={styles.transactionList}
          />
        )}
    </TouchableOpacity>
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

  return (
    <View style={styles.container}>
      <Text style={styles.header}>이름을 확인해주세요.</Text>
      <TextInput
        style={styles.input}
        placeholder="이름 입력"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      {!selectedPerson ? (
        <>
          <Text style={styles.subheader}>혹시 이 사람 아닌가요?</Text>
          <FlatList
            data={filteredPeople}
            renderItem={renderPersonItem}
            keyExtractor={item => item.id}
          />
        </>
      ) : (
        <>
          <Text style={styles.subheader}>경조사비 내역</Text>
          <FlatList
            data={selectedPerson.transactions}
            renderItem={renderTransactionItem}
            keyExtractor={(_, index) => index.toString()}
          />
        </>
      )}
      <View style={styles.buttonContainer}>
        <Button title="확인" onPress={() => console.log('확인 버튼 누름')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subheader: {
    fontSize: 16,
    marginVertical: 10,
  },
  input: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 20,
  },
  personItem: {
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    paddingVertical: 10,
  },
  personRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  personName: {
    fontSize: 16,
  },
  personAffiliation: {
    fontSize: 14,
    color: '#999',
  },
  transactionList: {
    marginTop: 10,
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
  buttonContainer: {
    marginTop: 20,
  },
});

export default FriendsearchScreen;
