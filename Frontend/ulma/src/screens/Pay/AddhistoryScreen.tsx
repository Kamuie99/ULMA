//수취내역추가하기 페이지
import CustomButton from '@/components/common/CustomButton';
import EventTag from '@/components/common/EventTag';
import {colors} from '@/constants';
import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';

export default function AddhistoryScreen() {
  const category = '돌잔치';
  return (
    <View style={styles.container}>
      {/* 이벤트 정보 */}
      <View style={styles.eventContainer}>
        <View style={styles.evTitleContainer}>
          <View>
            <Text style={styles.eventTitle}>내 돌잔치</Text>
            <Text style={styles.eventDate}>1997-10-01</Text>
          </View>
          <EventTag label={category} />
        </View>

        {/* 참여자 리스트 */}
        <View style={styles.listConatiner}>
          <TouchableOpacity
            style={styles.participantItem}
            onPress={() => Alert.alert('디테일 페이지로 이동')}>
            <View style={styles.infoContainer}>
              <View style={styles.personConatiner}>
                <Text style={styles.participantName}>이유찬</Text>
                <Text style={styles.participantGroup}>SSAFY</Text>
              </View>
              <Text style={styles.participantAmount}>100000 원</Text>
            </View>
            <View style={styles.detailButton}>
              <Icon name="chevron-right" size={20} color={colors.BLACK} />
            </View>
          </TouchableOpacity>
          <View style={styles.divider} />
        </View>
        <CustomButton label="입금 내역 추가하기" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.LIGHTGRAY,
  },
  eventContainer: {
    flex: 1,
    // 그림자
    shadowColor: colors.BLACK,
    shadowOpacity: 0.25, // 그림자의 투명도
    shadowRadius: 20, // 그림자의 흐림 정도
    elevation: 4,
    borderColor: colors.GRAY_300,
    backgroundColor: colors.WHITE,
    marginHorizontal: 16,
    marginVertical: 20,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 20,
    gap: 12,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.BLACK,
  },
  evTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  eventDate: {
    fontSize: 15,
    fontWeight: '400',
    color: colors.GRAY_700,
    marginTop: 5,
  },
  listConatiner: {
    alignItems: 'center',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
  },
  participantList: {
    marginTop: 20,
  },
  participantItem: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: '100%',
  },
  personConatiner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  participantName: {
    fontSize: 15,
    fontWeight: '400',
    color: 'black',
  },
  participantGroup: {
    fontSize: 15,
    fontWeight: '400',
    color: colors.GRAY_700,
  },
  participantAmount: {
    fontSize: 15,
    fontWeight: '400',
    color: 'black',
  },
  divider: {
    height: 1,
    width: '90%',
    backgroundColor: colors.GRAY_300,
  },
  detailButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginTop: 5,
  },
});
