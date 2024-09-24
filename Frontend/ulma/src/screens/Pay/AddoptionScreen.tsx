import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';

const options = [
  {
    key: '1',
    label: '계좌 내역 불러오기',
    description: '계좌 내역에서 선택 후 바로 등록해보세요.',
    imageUrl: 'https://via.placeholder.com/28x26',
  },
  {
    key: '2',
    label: '엑셀 등록하기',
    description: '적어 놓은 내역을 등록해보세요.',
    imageUrl: 'https://via.placeholder.com/26x30',
  },
  {
    key: '3',
    label: '직접 등록하기',
    description: '직접 받은 경조사비를 등록해보세요.',
    imageUrl: 'https://via.placeholder.com/26x28',
  },
];

const AddoptionScreen: React.FC = () => {
  const handlePress = (label: string) => {
    console.log(`${label} 선택됨`);
  };

  // 수정된 renderItem 함수
  const renderItem = ({item}: {item: (typeof options)[0]}) => (
    <TouchableOpacity onPress={() => handlePress(item.label)}>
      <View style={styles.optionContainer}>
        <Image style={styles.icon} source={{uri: item.imageUrl}} />
        <View style={styles.textContainer}>
          <Text style={styles.optionLabel}>{item.label}</Text>
          <Text style={styles.optionDescription}>{item.description}</Text>
        </View>
        <View style={styles.arrow}>
          <View style={styles.arrowInner} />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={options}
        renderItem={renderItem}
        keyExtractor={item => item.key}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    marginBottom: 10,
  },
  icon: {
    width: 28,
    height: 28,
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  optionLabel: {
    fontSize: 14,
    fontFamily: 'SamsungGothicCondensed',
    fontWeight: '400',
    color: 'black',
  },
  optionDescription: {
    fontSize: 13,
    fontFamily: 'SamsungGothicCondensed',
    fontWeight: '400',
    color: '#A7A7A7',
    marginTop: 5,
  },
  arrow: {
    width: 6,
    height: 12,
    transform: [{rotate: '180deg'}],
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowInner: {
    borderWidth: 1.5,
    borderColor: 'black',
  },
});

export default AddoptionScreen;
