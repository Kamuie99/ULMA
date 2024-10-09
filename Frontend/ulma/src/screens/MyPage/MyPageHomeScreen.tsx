import React, {useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert, // 로그아웃 확인창을 띄우기 위한 Alert import
} from 'react-native';
import {
  eventNavigations,
  friendsNavigations,
  mypageNavigations,
} from '@/constants/navigations';
import usePayStore from '@/store/usePayStore';
import {payNavigations} from '@/constants/navigations';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon3 from 'react-native-vector-icons/MaterialIcons';
import useAuthStore from '@/store/useAuthStore';
import {colors} from '@/constants';

interface MyPageHomeScreenProps {
  navigation: any; // 실제 프로젝트에서는 더 구체적인 타입을 사용해야 합니다
}

function MyPageHomeScreen({navigation}: MyPageHomeScreenProps) {
  const {logout, userInfo} = useAuthStore();
  const {balance} = usePayStore();
  // fetchUserInfo

  // useEffect(() => {
  //   fetchUserInfo();
  // }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.InfoBox}>
        <TouchableOpacity
          onPress={() => navigation.navigate(mypageNavigations.USER_DETAIL)}>
          <View style={styles.userInfoBox}>
            <View style={styles.userInfo_name_email}>
              <Text style={styles.userName}>{userInfo?.name || '사용자'}</Text>
              <Text style={styles.userEmail}>
                {userInfo?.email || '이메일 없음'}
              </Text>
            </View>
            <Icon
              style={styles.useInfoBoxIcon}
              name="chevron-forward"
              size={20}
              color="#666"
            />
          </View>
        </TouchableOpacity>

        {/* 구분선 추가 */}
        <View style={styles.separator} />

        <TouchableOpacity style={styles.payInfo}>
          <Text style={styles.accountInfoTitle}>
            <Text style={styles.titlecolor}>ULMA</Text> PAY
          </Text>
          <Text style={styles.accountBalance}>
            {balance === -1 ? '연결된 페이 없음' : `${balance} 원`}
          </Text>
        </TouchableOpacity>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate(payNavigations.PAY_RECHARGE)}>
            <Text style={styles.buttonText}>충전</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>송금</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate(payNavigations.PAY_LIST)}>
            <Text style={styles.buttonText}>내역</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.InfoBox}>
        <Text>계좌 관리</Text>

        <TouchableOpacity style={styles.InfoBoxInner}>
          <View style={styles.MenuBar}>
            <Icon2 name="account-plus" size={24} color="#000" />
            <Text style={styles.InfoMenu}>내 계좌 등록하기</Text>
          </View>
          <Icon name="chevron-forward" size={15} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.InfoBoxInner}>
          <View style={styles.MenuBar}>
            <Icon2 name="account-search" size={24} color="#000" />
            <Text style={styles.InfoMenu}>내 계좌 보기</Text>
          </View>
          <Icon name="chevron-forward" size={15} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.InfoBoxInner}>
          <View style={styles.MenuBar}>
            <Icon2 name="account-network" size={24} color="#000" />
            <Text style={styles.InfoMenu}>연결 계좌 정보</Text>
          </View>
          <Icon name="chevron-forward" size={15} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.InfoBoxInner}>
          <View style={styles.MenuBar}>
            <Icon2 name="account-remove" size={24} color="#000" />
            <Text style={styles.InfoMenu}>연결 계좌 삭제</Text>
          </View>
          <Icon name="chevron-forward" size={15} color="#666" />
        </TouchableOpacity>
      </View>

      <View style={styles.InfoBox}>
        <Text>지인 관리</Text>

        <TouchableOpacity
          style={styles.InfoBoxInner}
          onPress={() => navigation.navigate(friendsNavigations.FRIENDS_LIST)}>
          <View style={styles.MenuBar}>
            <Icon2 name="account-search" size={24} color="#000" />
            <Text style={styles.InfoMenu}>지인 목록 조회</Text>
          </View>
          <Icon name="chevron-forward" size={15} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.InfoBoxInner}
          onPress={() => navigation.navigate(friendsNavigations.FRIENDS_ADD)}>
          <View style={styles.MenuBar}>
            <Icon2 name="account-plus" size={24} color="#000" />
            <Text style={styles.InfoMenu}>지인 신규 등록</Text>
          </View>
          <Icon name="chevron-forward" size={15} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.InfoBoxInner}>
          <View style={styles.MenuBar}>
            <Icon2 name="typewriter" size={24} color="#000" />
            <Text style={styles.InfoMenu}>경조사비 내역 수기 등록</Text>
          </View>
          <Icon name="chevron-forward" size={15} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.InfoBoxInner}>
          <View style={styles.MenuBar}>
            <Icon2 name="microsoft-excel" size={24} color="#000" />
            <Text style={styles.InfoMenu}>경조사비 내역 엑셀 등록</Text>
          </View>
          <Icon name="chevron-forward" size={15} color="#666" />
        </TouchableOpacity>
      </View>

      <View style={styles.InfoBox}>
        <Text>
          <Text style={styles.buttonText}>{userInfo?.name || '사용자'}</Text>{' '}
          님을 위한 추천 서비스
        </Text>

        <TouchableOpacity style={styles.InfoBoxInner}>
          <View style={styles.MenuBar}>
            <Icon2 name="star-four-points-outline" size={24} color="#000" />
            <Text style={styles.InfoMenu}>
              <Text style={styles.titlecolor}>ULMA</Text> AI 금액 추천
            </Text>
          </View>
          <Icon name="chevron-forward" size={15} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.InfoBoxInner}
          onPress={() => navigation.navigate(payNavigations.RECOMMEND_OPTION)} // AiRecommendScreen으로 이동
        >
          <View style={styles.MenuBar}>
            <Icon3 name="attach-money" size={24} color="#000" />
            <Text style={styles.InfoMenu}>GPT-4o 금액추천</Text>
          </View>
          <Icon name="chevron-forward" size={15} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.InfoBoxInner}>
          <View style={styles.MenuBar}>
            <Icon3 name="people-outline" size={24} color="#000" />
            <Text style={styles.InfoMenu}>동나이대 비교 금액 추천</Text>
          </View>
          <Icon name="chevron-forward" size={15} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.InfoBoxInner}
          onPress={() =>
            navigation.navigate(eventNavigations.AI_RECOMMEND_MESSAGE)
          } // 정확한 경로 사용
        >
          <View style={styles.MenuBar}>
            <Icon2 name="message-text-outline" size={24} color="#000" />
            <Text style={styles.InfoMenu}>메세지 추천</Text>
          </View>
          <Icon name="chevron-forward" size={15} color="#666" />
        </TouchableOpacity>
      </View>

      {/* <Text style={styles.sectionTitle}>계좌 관리</Text>

      <TouchableOpacity style={styles.option}>
        <Text style={styles.optionText}>연결 계좌 변경</Text>
        <Icon name="chevron-forward" size={24} color="#000" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.option}
        onPress={() =>
          navigation.navigate('Pay', {screen: payNavigations.PAY_RECHARGE})
        }>
        <Text style={styles.optionText}>Pay 충전하기</Text>
        <Icon name="chevron-forward" size={24} color="#000" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.option}
        onPress={() => navigation.navigate(payNavigations.PAY_LIST)}>
        <Text style={styles.optionText}>Pay 이력보기</Text>
        <Icon name="chevron-forward" size={24} color="#000" />
      </TouchableOpacity>

      <Text style={[styles.sectionTitle, styles.contactManagement]}>
        지인 관리
      </Text>

      <TouchableOpacity style={styles.option}>
        <Text style={styles.optionText}>지인 목록 보기</Text>
        <Icon name="chevron-forward" size={24} color="#000" />
      </TouchableOpacity> */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  InfoBox: {
    flexDirection: 'column',
    marginBottom: 20,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
  },
  userInfoBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  useInfoBoxIcon: {
    marginTop: 13,
  },
  userInfo_name_email: {
    marginBottom: 20,
  },
  userInfoRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  logoutText: {
    fontSize: 14,
    color: '#ff0000', // 로그아웃 텍스트의 색상 (빨간색)
    marginRight: 10, // 텍스트와 아이콘 사이 간격
  },
  accountInfoBox: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 15,
    marginBottom: 30,
  },
  accountInfoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  accountNumber: {
    fontSize: 14,
    marginBottom: 5,
  },
  accountBalance: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  optionText: {
    fontSize: 16,
  },
  contactManagement: {
    marginTop: 30,
  },
  payInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  InfoBoxInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
  },
  InfoMenu: {
    fontSize: 16,
  },
  MenuBar: {
    flexDirection: 'row',
    gap: 15,
  },
  titlecolor: {
    color: colors.GREEN_700,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    backgroundColor: colors.GRAY_300,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.BLACK,
    fontSize: 14,
  },
  separator: {
    height: 1, // 선의 두께
    backgroundColor: '#ddd', // 선의 색상
    marginBottom: 20,
  },
});

export default MyPageHomeScreen;
