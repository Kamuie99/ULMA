//수취내역추가하기 페이지
import {colors} from '@/constants';
import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';

export default function AddhistoryScreen() {
  return (
    <View style={styles.container}>
      {/* 이벤트 정보 */}
      <View style={styles.eventContainer}>
        <Text style={styles.eventTitle}>내 돌잔치</Text>
        <Text style={styles.eventDate}>1997-10-01</Text>

        {/* 참여자 리스트 */}

        <View style={styles.participantItem}>
          <Text style={styles.participantName}>이유찬</Text>
          <Text style={styles.participantGroup}>SSAFY</Text>
          <Text style={styles.participantAmount}>100000 원</Text>
        </View>
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
    marginHorizontal: 16,
    marginVertical: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    borderWidth: 1,
    borderColor: '#D9D9D9',
  },
  eventTitle: {
    fontSize: 18,
    fontFamily: 'SamsungGothicCondensed',
    fontWeight: '400',
    color: 'black',
  },
  eventDate: {
    fontSize: 15,
    fontFamily: 'SamsungGothicCondensed',
    fontWeight: '400',
    color: '#A7A7A7',
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
