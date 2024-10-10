import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import CustomButton from '@/components/common/CustomButton';
import TitleTextField from '@/components/common/TitleTextField';
import {colors} from '@/constants';
import Slider from '@react-native-community/slider';

// 이모지 이미지 import
import relationship1 from '@/assets/Pay/relationship1.png';
import relationship2 from '@/assets/Pay/relationship2.png';
import relationship3 from '@/assets/Pay/relationship3.png';

function FriendshipselectScreen({navigation}) {
  useEffect(() => {
    // 페이지에 들어올 때 탭바 숨기기
    navigation.getParent()?.setOptions({
      tabBarStyle: {display: 'none'},
    });
  }, [navigation]);

  const [sliderValue, setSliderValue] = useState<number>(0); // 슬라이드 값 상태 관리

  // 이모지 데이터
  // 이모지 이미지 넣을 때 50% size 축소해서 넣어야 함
  const emojis = [
    {
      id: 1,
      src: relationship1,
      label: '가까운 사이는 아니에요',
    },
    {
      id: 2,
      src: relationship2,
      label: '그냥 그래요.',
    },
    {
      id: 3,
      src: relationship3,
      label: '매우 가까워요',
    },
  ];

  // 슬라이더 값에 따라 적절한 이모지 선택
  const getEmojiForSliderValue = () => {
    if (sliderValue == 0) {
      return emojis[0].src; // 첫 번째 이모지
    } else if (sliderValue == 1) {
      return emojis[1].src; // 두 번째 이모지
    } else {
      return emojis[2].src; // 세 번째 이모지
    }
  };

  return (
    <View style={styles.container}>
      <TitleTextField frontLabel="" emphMsg="이유찬" backLabel="님과" />
      <TitleTextField frontLabel="얼마나 가까운 사이인가요?" />

      <Slider
        style={{height: 100, marginHorizontal: 30, marginTop: 40}}
        minimumValue={0}
        maximumValue={2}
        step={1}
        minimumTrackTintColor={colors.GREEN_300}
        maximumTrackTintColor={colors.GRAY_300}
        value={sliderValue}
        onValueChange={setSliderValue} // 슬라이드 값이 변경될 때 상태 업데이트
        thumbImage={getEmojiForSliderValue()} // 슬라이드 값에 따라 이모지 변경
      />
      <View style={styles.labelContainer}>
        <Text style={styles.emojiLabel}>가까운 사이는 아니에요.</Text>
        <Text style={styles.emojiLabel}>매우 가까워요.</Text>
      </View>

      {/* 확인 버튼 */}
      <CustomButton label="확인" variant="outlined" />
    </View>
  );
}

// 스타일 정의
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 30,
  },
  emojiWrapper: {
    alignItems: 'center',
  },
  labelContainer: {
    marginHorizontal: 35,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -20,
  },
  emojiLabel: {
    fontSize: 13,
    color: colors.GRAY_700,
  },
});

export default FriendshipselectScreen;
