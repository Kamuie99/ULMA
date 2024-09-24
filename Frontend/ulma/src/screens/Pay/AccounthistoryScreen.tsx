//입출금 내역 선택 페이지
import React, {useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Button,
} from 'react-native';

interface Transaction {
  id: string;
  name: string;
  amount: string;
  selected: boolean;
}

const AccounthistoryScreen = () => {
  const [data, setData] = useState<Transaction[]>([
    {id: '1', name: '싸피은행환급', amount: '17 원', selected: false},
    {id: '2', name: '싸피이유찬', amount: '100,000 원', selected: false},
    {id: '3', name: '계좌확인', amount: '1 원', selected: false},
    {id: '4', name: '윤예리', amount: '100,000 원', selected: false},
    {id: '5', name: '윤동환', amount: '100,000 원', selected: false},
  ]);

  const toggleSelect = (id: string) => {
    setData(prevData =>
      prevData.map(item =>
        item.id === id ? {...item, selected: !item.selected} : item,
      ),
    );
  };

  const renderItem = ({item}: {item: Transaction}) => (
    <TouchableOpacity
      style={[styles.item, item.selected && styles.selectedItem]}
      onPress={() => toggleSelect(item.id)}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.amount}>{item.amount}</Text>
      {item.selected && <Text style={styles.checkmark}>✔️</Text>}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>계좌 내역 확인하기</Text>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.list}
      />
      <View style={styles.buttonContainer}>
        <Button title="확인" onPress={() => console.log('확인 버튼 눌림')} />
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
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  list: {
    flexGrow: 0,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 10,
    borderRadius: 10,
  },
  selectedItem: {
    backgroundColor: '#FDEDEC', // 선택된 항목 배경색
  },
  name: {
    fontSize: 16,
  },
  amount: {
    fontSize: 16,
  },
  checkmark: {
    fontSize: 18,
    color: '#FF5E5E', // 체크표시 색상
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
});

export default AccounthistoryScreen;
