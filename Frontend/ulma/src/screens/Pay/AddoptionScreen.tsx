import {colors} from '@/constants';
import React, {useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';

const options = [
  {
    key: '1',
    label: '계좌 내역 불러오기',
    description: '계좌 내역에서 선택 후 바로 등록해보세요.',
    imageUrl: require('@/assets/Pay/modal/option1.png'),
  },
  {
    key: '2',
    label: '엑셀 등록하기',
    description: '적어 놓은 내역을 등록해보세요.',
    imageUrl: require('@/assets/Pay/modal/option2.png'),
  },
  {
    key: '3',
    label: '직접 등록하기',
    description: '직접 받은 경조사비를 등록해보세요.',
    imageUrl: require('@/assets/Pay/modal/option3.png'),
  },
];

function AddoptionScreen({navigation}) {
  useEffect(() => {
    // 페이지에 들어올 때 탭바 숨기기
    navigation.getParent()?.setOptions({
      tabBarStyle: {display: 'none'},
    });
  }, [navigation]);

  const handlePress = (label: string) => {
    console.log(`${label} 선택됨`);
  };

  // 수정된 renderItem 함수
  const renderItem = ({item}: {item: (typeof options)[0]}) => (
    <TouchableOpacity onPress={() => handlePress(item.label)}>
      <View style={styles.optionContainer}>
        <Image style={styles.icon} source={item.imageUrl} />
        <View style={styles.textContainer}>
          <Text style={styles.optionLabel}>{item.label}</Text>
          <Text style={styles.optionDescription}>{item.description}</Text>
        </View>
        <View style={styles.arrow}>
          <Icon name="chevron-right" size={20} color={colors.BLACK} />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.modalBody}>
        <FlatList
          data={options}
          renderItem={renderItem}
          keyExtractor={item => item.key}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },
  modalBody: {
    backgroundColor: colors.WHITE,
    paddingBottom: '20%',
    paddingTop: '3%',
    borderTopLeftRadius: 15, // 왼쪽 위 둥근 모서리
    borderTopRightRadius: 15, // 오른쪽 위 둥근 모서리
  },
  icon: {
    width: 28,
    height: 28,
    marginRight: 7,
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: 'black',
  },
  optionDescription: {
    fontSize: 13,
    fontWeight: '400',
    color: colors.GRAY_700,
    marginTop: 5,
  },
  arrow: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AddoptionScreen;
