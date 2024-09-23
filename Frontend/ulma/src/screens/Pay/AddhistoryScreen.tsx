//수취내역추가하기 페이지
import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';

export default function AddhistoryScreen() {
  return (
    <View style={styles.container}>
      {/* 상단 이벤트 제목 */}
      <View style={styles.header}>
        <Text style={styles.headerText}>이벤트 자세히 보기</Text>
      </View>

      {/* 이벤트 정보 */}
      <View style={styles.eventContainer}>
        <Text style={styles.eventTitle}>내 돌잔치</Text>
        <Text style={styles.eventDate}>1997-10-01</Text>

        {/* 참여자 리스트 */}
        <View style={styles.participantList}>
          {[
            {name: '이유찬', group: 'SSAFY', amount: '100,000 원'},
            {name: '권대호', group: 'SSAFY', amount: '100,000 원'},
            {name: '윤동환', group: 'SSAFY', amount: '100,000 원'},
          ].map((person, index) => (
            <View key={index}>
              <View style={styles.participantItem}>
                <Text style={styles.participantName}>{person.name}</Text>
                <Text style={styles.participantGroup}>{person.group}</Text>
                <Text style={styles.participantAmount}>{person.amount}</Text>
              </View>
              {index < 2 && <View style={styles.divider} />} {/* 구분선 */}
            </View>
          ))}
        </View>
      </View>

      {/* 수취 내역 추가하기 버튼 */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          Alert.alert('수취 내역 추가하기'); // Alert 사용
        }}>
        <Text style={styles.addButtonText}>수취 내역 추가하기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  header: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 14,
    fontFamily: 'SamsungGothicCondensed',
    fontWeight: '400',
    color: 'black',
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
    fontFamily: 'SamsungGothicCondensed',
    fontWeight: '400',
  },
});
