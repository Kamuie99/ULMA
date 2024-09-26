//메인페이지 - 슬라이드 넘어가지게

import CustomButton from '@/components/common/CustomButton';
import {colors} from '@/constants';
import {authNavigations} from '@/constants/navigations';
import {AuthStackParamList} from '@/navigations/stack/AuthStackNavigator';
import {RouteProp, useNavigation} from '@react-navigation/native';
import {StackNavigationProp, StackScreenProps} from '@react-navigation/stack';
import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Animated,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  TouchableOpacity,
  Image,
} from 'react-native';

const {width} = Dimensions.get('window');

interface Slide {
  id: string;
  image: any;
  title: string;
  description: string;
}

interface PaginationProps {
  data: Slide[];
  scrollX: Animated.Value;
}

interface SlideItemProps {
  item: Slide;
}

const slides: Slide[] = [
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

const SlideItem: React.FC<SlideItemProps> = ({item}) => {
  return (
    <View style={styles.slide}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <Image source={item.image} style={styles.image} />
    </View>
  );
};

const Pagination: React.FC<PaginationProps> = ({data, scrollX}) => {
  return (
    <View style={{flexDirection: 'row', height: 64}}>
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
            style={[
              styles.dot,
              {
                width: dotWidth,
                opacity,
              },
            ]}
          />
        );
      })}
    </View>
  );
};

type AuthHomeScreenProps = StackScreenProps<
  AuthStackParamList,
  typeof authNavigations.AUTH_HOME
>;

function AuthHomeScreen({navigation}: AuthHomeScreenProps) {
  const scrollX = useRef(new Animated.Value(0)).current;
  const [, setCurrentSlideIndex] = useState(0);

  const updateCurrentSlideIndex = (
    e: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / width);
    setCurrentSlideIndex(currentIndex);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={slides}
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
      <Pagination data={slides} scrollX={scrollX} />

      <CustomButton
        label="시작하기"
        onPress={() => navigation.navigate(authNavigations.LOGIN_HOME)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  slide: {
    width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '80%',
    height: '60%',
    resizeMode: 'contain',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'left',
    width: '90%',
    color: colors.BLACK,
  },
  description: {
    fontSize: 14,
    color: colors.GRAY_700,
    textAlign: 'left',
    width: '90%',
    marginHorizontal: 20,
    marginTop: 10,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.GRAY_700,
    marginHorizontal: 5,
  },
});

export default AuthHomeScreen;
