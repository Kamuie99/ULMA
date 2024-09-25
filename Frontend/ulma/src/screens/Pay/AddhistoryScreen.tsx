//수취내역추가하기 페이지
import CustomButton from '@/components/common/CustomButton';
import {colors} from '@/constants';
import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';

export default function AddhistoryScreen() {
  return (
    <View style={styles.container}>
      {/* 이벤트 정보 */}
      <View style={styles.eventContainer}>
        <View style={styles.evTitleContainer}>
          <View>
            <Text style={styles.eventTitle}>내 돌잔치</Text>
            <Text style={styles.eventDate}>1997-10-01</Text>
          </View>
        </View>

        {/* 참여자 리스트 */}
        <View style={styles.participantItem}>
          <Text style={styles.participantName}>이유찬</Text>
          <Text style={styles.participantGroup}>SSAFY</Text>
          <Text style={styles.participantAmount}>100000 원</Text>
        </View>
        <CustomButton label="받은 돈 추가하기" />
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
    padding: 20,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.BLACK,
  },
  evTitleContainer: {
    flexDirection: 'row',
  },
  eventDate: {
    fontSize: 15,
    fontWeight: '400',
    color: colors.GRAY_700,
    marginTop: 5,
  },
  participantList: {
    marginTop: 20,
  },
  participantItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  participantName: {
    fontSize: 15,
    fontFamily: 'SamsungGothicCondensed',
    fontWeight: '400',
    color: 'black',
  },
  participantGroup: {
    fontSize: 15,
    fontFamily: 'SamsungGothicCondensed',
    fontWeight: '400',
    color: '#A7A7A7',
  },
  participantAmount: {
    fontSize: 15,
    fontFamily: 'SamsungGothicCondensed',
    fontWeight: '400',
    color: 'black',
  },
  divider: {
    height: 1,
    backgroundColor: '#DADADA',
  },
  addButton: {
    marginHorizontal: 35,
    marginTop: 30,
    backgroundColor: '#3FC89E',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 14,
    color: 'white',
    fontWeight: '400',
  },
});
