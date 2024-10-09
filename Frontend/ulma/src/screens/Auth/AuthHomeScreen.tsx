import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Animated,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Text,
} from 'react-native';
import CustomButton from '@/components/common/CustomButton';
import FastImage from 'react-native-fast-image';
import {colors} from '@/constants';
import {authNavigations} from '@/constants/navigations';
import {StackScreenProps} from '@react-navigation/stack';
import {AuthStackParamList} from '@/navigations/stack/AuthStackNavigator';

const {width} = Dimensions.get('window');

const slides = [
  {
    id: '1',
    image: require('@/assets/Home/home1.gif'),
    title: '결혼식 축의금 장부 정리',
    description: '사진 촬영만으로 한 번에!',
  },
  {
    id: '2',
    image: require('@/assets/Home/home2.gif'),
    title: '복잡한 경조사 일정 자동으로 정리',
    description: '쉽고 편하게',
  },
  {
    id: '3',
    image: require('@/assets/Home/home3.gif'),
    title: '애매한 경조사비 분석',
    description: '소비 패턴 분석 후 추천드려요!',
  },
];

const AuthHomeScreen = ({navigation}) => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const updateCurrentSlideIndex = (
    e: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / width);
    setCurrentSlideIndex(currentIndex);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      let nextIndex = currentSlideIndex + 1;
      if (nextIndex >= slides.length) {
        nextIndex = 0; // 마지막 슬라이드 후 다시 처음으로
      }
      flatListRef.current?.scrollToOffset({
        offset: nextIndex * width,
        animated: true,
      });
      setCurrentSlideIndex(nextIndex);
    }, 2000); // 2초마다 슬라이드 전환

    return () => clearInterval(interval); // 컴포넌트가 언마운트될 때 타이머 정리
  }, [currentSlideIndex]);

  return (
    <View style={styles.container}>
      <FlatList
        data={slides}
        ref={flatListRef}
        renderItem={({item}) => <SlideItem item={item} />}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {x: scrollX}}}],
          {useNativeDriver: false},
        )}
        onMomentumScrollEnd={updateCurrentSlideIndex}
      />
      <View style={{marginBottom: 200}}>
        <Pagination data={slides} scrollX={scrollX} />
      </View>

      <CustomButton
        label="시작하기"
        posY={100}
        size="large"
        onPress={() => navigation.navigate(authNavigations.LOGIN_HOME)}
      />
    </View>
  );
};

const SlideItem = ({item}) => (
  <View style={styles.slide}>
    <Text style={styles.title}>{item.title}</Text>
    <Text style={styles.description}>{item.description}</Text>
    <FastImage
      source={item.image}
      style={styles.image}
      resizeMode={FastImage.resizeMode.contain}
    />
  </View>
);

const Pagination = ({data, scrollX}) => (
  <View style={{flexDirection: 'row'}}>
    {data.map((_, i) => {
      const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
      const dotWidth = scrollX.interpolate({
        inputRange,
        outputRange: [8, 16, 8],
        extrapolate: 'clamp',
      });
      const opacity = scrollX.interpolate({
        inputRange,
        outputRange: [0.3, 1, 0.3],
        extrapolate: 'clamp',
      });
      return (
        <Animated.View
          key={i.toString()}
          style={[styles.dot, {width: dotWidth, opacity}]}
        />
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slide: {
    width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '70%',
    height: '50%',
    marginTop: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'left',
    width: '90%',
    color: colors.BLACK,
  },
  description: {
    fontSize: 20,
    color: colors.GRAY_700,
    textAlign: 'left',
    width: '90%',
    marginHorizontal: 20,
    marginTop: 5,
    marginBottom: 20,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.GRAY_700,
    marginHorizontal: 5,
  },
});

export default AuthHomeScreen;
