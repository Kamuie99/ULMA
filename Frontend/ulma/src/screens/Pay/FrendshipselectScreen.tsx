import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';

const RelationshipScreen = () => {
  const [selected, setSelected] = useState<number | null>(null);

  const handleSelect = (index: number) => {
    setSelected(index);
  };

  const emojis = [
    {label: '가까운 사이는 아니에요', src: 'https://via.placeholder.com/51x51'},
    {label: '', src: 'https://via.placeholder.com/51x51'}, // Middle emoji
    {label: '매우 가까워요', src: 'https://via.placeholder.com/51x51'},
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AI 추천 금액</Text>
      </View>

{/* Question */}
<View style={styles.questionContainer}>
  <Text>
    {'  '}
    <Text style={styles.nameText}>이유찬</Text>
    <Text style={styles.questionText}>
      {'님과 {'\n'}얼마나 가까운 사이인가요?'}
    </Text>
  </Text>
</View>

<View style={styles.divider}></View>

{/* Emojis with selection */}
<View style={styles.emojisContainer}>
  {emojis.map((emoji, index) => (
    <TouchableOpacity
      key={index}
      onPress={() => handleSelect(index)}
      style={styles.emojiWrapper}
    >
      {selected === index && (
        <Text style={styles.checkmark}>✔</Text> // Checkmark above selected emoji
      )}
      <Image source={{ uri: emoji.src }} style={styles.emojiImage} />
      <Text style={styles.emojiLabel}>{emoji.label}</Text>
    </TouchableOpacity>
  ))}
</View>


      {/* Confirm Button */}
      <TouchableOpacity style={styles.confirmButton}>
        <Text style={styles.confirmText}>확인</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  headerTitle: {
    color: 'black',
    fontSize: 14,
    fontFamily: 'SamsungGothicCondensed',
    fontWeight: '400',
  },
  questionContainer: {
    paddingLeft: 33,
    paddingTop: 40,
  },
  nameText: {
    color: '#3FC89E',
    fontSize: 22,
    fontFamily: 'SamsungGothicCondensed',
    fontWeight: '400',
  },
  questionText: {
    color: 'black',
    fontSize: 22,
    fontFamily: 'SamsungGothicCondensed',
    fontWeight: '400',
  },
  divider: {
    height: 1,
    backgroundColor: '#A7A7A7',
    marginTop: 30,
    marginHorizontal: 34,
  },
  emojisContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  emojiWrapper: {
    alignItems: 'center',
  },
  emojiImage: {
    width: 51,
    height: 51,
  },
  emojiLabel: {
    color: '#A7A7A7',
    fontSize: 12,
    fontFamily: 'SamsungGothicCondensed',
    fontWeight: '400',
    marginTop: 10,
  },
  checkmark: {
    fontSize: 24,
    color: '#3FC89E',
    position: 'absolute',
    top: -30,
  },
  confirmButton: {
    backgroundColor: '#C2EADF',
    borderRadius: 8,
    paddingVertical: 15,
    marginHorizontal: 35,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 20,
  },
  confirmText: {
    color: '#3FC89E',
    fontSize: 14,
    fontFamily: 'SamsungGothicCondensed',
    fontWeight: '400',
  },
});

export default RelationshipScreen;
