import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import RootNavigator from '@/navigations/root/RootNavigator';
import useAuthStore from '@/store/useAuthStore';
import Toast from 'react-native-toast-message';

function App() {
  const loadTokens = useAuthStore(state => state.loadTokens); // loadTokens 함수 가져오기

  // 앱이 시작될 때 토큰을 불러오는 useEffect 훅
  useEffect(() => {
    const initializeAuth = async () => {
      await loadTokens(); // 토큰을 불러와서 로그인 상태 유지
    };

    initializeAuth();
  }, []); // 처음 한 번만 실행

  return (
    <NavigationContainer>
      <RootNavigator />
      <Toast ref={ref => Toast.setRef(ref)} />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({});

export default App;
