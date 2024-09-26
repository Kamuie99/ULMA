import React, {useEffect, useRef} from 'react';
import {Animated, StyleSheet, Text, View} from 'react-native';
import CustomButton from '@/components/common/CustomButton';
import {AuthStackParamList} from '@/navigations/stack/AuthStackNavigator';
import {authNavigations} from '@/constants/navigations';
import {StackScreenProps} from '@react-navigation/stack';
import TitleTextField from '@/components/common/TitleTextField';
import {colors} from '@/constants';

type LoginHomeScreenProps = StackScreenProps<
  AuthStackParamList,
  typeof authNavigations.LOGIN_HOME
>;

function LoginHomeScreen({navigation}: LoginHomeScreenProps) {
  // 애니메이션 상태를 위한 Animated.Value 생성
  const fadeAnim1 = useRef(new Animated.Value(0)).current;
  const fadeAnim2 = useRef(new Animated.Value(0)).current;
  const fadeAnim3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 순차적으로 투명도를 변경하여 애니메이션 효과 적용
    Animated.sequence([
      Animated.timing(fadeAnim1, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim2, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim3, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.titles}>
        <Animated.View style={[styles.titles, {opacity: fadeAnim1}]}>
          <TitleTextField frontLabel="반가워요!" />
        </Animated.View>
        <Animated.Text style={[styles.title, {opacity: fadeAnim2}]}>
          나만의 경조사비 관리 비서
        </Animated.Text>
        <Animated.View style={[styles.titleContainer, {opacity: fadeAnim3}]}>
          <Text style={styles.title3}>ULMA</Text>
          <Text style={styles.title2}> 입니다.</Text>
        </Animated.View>
      </View>
      <View style={styles.buttons}>
        <Text style={styles.buttonText}>시작 방법을 선택해주세요.</Text>
        <View style={styles.buttonLayout}>
          <CustomButton
            label="로그인"
            onPress={() => navigation.navigate(authNavigations.LOGIN)}
            customStyle={{position: 'absolute'}}
            posY={0}
          />
          <CustomButton
            label="회원 가입"
            onPress={() => navigation.navigate(authNavigations.SIGNUP1)}
            variant="outlined"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.LIGHTGRAY,
    flex: 1,
  },
  titles: {
    marginTop: 40,
    paddingTop: 40,
    marginVertical: 20,
  },
  title: {
    fontSize: 20,
    marginLeft: 20,
    color: colors.BLACK,
  },
  title2: {
    fontSize: 20,
    color: colors.BLACK,
  },
  title3: {
    fontSize: 20,
    marginLeft: 20,
    color: colors.GREEN_700,
    fontWeight: 'bold',
  },
  titleContainer: {
    flexDirection: 'row',
  },
  buttonText: {
    textAlign: 'center',
    marginLeft: 0,
    marginBottom: -25,
    fontSize: 16,
    color: colors.GRAY_700,
  },
  buttons: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  buttonLayout: {
    height: 200,
    marginBottom: 100,
  },
});

export default LoginHomeScreen;
