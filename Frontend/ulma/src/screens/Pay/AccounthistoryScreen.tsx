//입출금 내역 선택 페이지
import CustomButton from '@/components/common/CustomButton';
import {colors} from '@/constants';
import React, {useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Button,
} from 'react-native';
import symbolicateStackTrace from 'react-native/Libraries/Core/Devtools/symbolicateStackTrace';

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
      <Text>
        {item.selected ? (
          <Text style={styles.check}>√</Text>
        ) : (
          <Text style={styles.noCheck}>▢</Text>
        )}
      </Text>
      <View style={styles.textContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.amount}>{item.amount}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.cardContiner}>
        <View style={styles.accountInfoContainer}>
          <Text style={styles.accountInfo}>싸피은행</Text>
          <Text style={styles.accountInfo}>000-1111-000-1111</Text>
        </View>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          style={styles.list}
        />
        <CustomButton label="확인" variant="outlined" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.LIGHTGRAY,
  },
  accountInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 25,
    marginBottom: 10,
  },
  accountInfo: {
    color: colors.GRAY_700,
    fontSize: 16,
  },
  cardContiner: {
    flex: 1,
    backgroundColor: colors.WHITE,
    margin: 20,
    paddingTop: 20,
    borderRadius: 15,
    borderColor: colors.GRAY_300,
    borderWidth: 1,
    shadowColor: colors.BLACK,
    shadowOpacity: 0.25, // 그림자의 투명도
    shadowRadius: 20, // 그림자의 흐림 정도
    elevation: 4,
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
  },
  list: {
    flexGrow: 0,
    paddingHorizontal: 20,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    paddingVertical: 10,
    // borderRadius: 10,
    marginVertical: 2,
  },
  selectedItem: {
    backgroundColor: '#FDEDEC', // 선택된 항목 배경색
  },
  name: {
    fontSize: 16,
    width: '50%',
    alignItems: 'flex-start',
  },
  amount: {
    fontSize: 16,
  },
  noCheck: {
    fontSize: 18,
    fontWeight: '800',
  },
  check: {
    fontSize: 18,
    color: colors.PINK,
    fontWeight: '800',
  },
});

export default AccounthistoryScreen;
