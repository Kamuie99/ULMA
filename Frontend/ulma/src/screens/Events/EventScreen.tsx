import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Animated,
  PanResponder,
} from 'react-native';
import {NavigationProp, useFocusEffect} from '@react-navigation/native';
import axiosInstance from '@/api/axios';
import {eventNavigations} from '@/constants/navigations';
import Icon from 'react-native-vector-icons/Ionicons';
import useEventStore from '@/store/useEventStore';
import {colors} from '@/constants';

interface Event {
  id: string;
  category: string;
  name: string;
  eventTime: string;
}

const EventScreen = ({navigation}: {navigation: NavigationProp<any>}) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const {setEventID} = useEventStore();

  const fetchEvents = async () => {
    try {
      const response = await axiosInstance.get('/events');
      setEvents(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('이벤트 목록을 불러오는 중 오류 발생:', error);
      Alert.alert('에러', '이벤트 목록을 불러오는 중 오류가 발생했습니다.');
      setLoading(false);
    }
  };

  const deleteEvent = async (eventId: string) => {
    try {
      await axiosInstance.delete(`/events/${eventId}`);
      Alert.alert('완료', '이벤트가 삭제되었습니다.');
      fetchEvents();
    } catch (error) {
      console.error('이벤트 삭제 중 오류 발생:', error);
      Alert.alert('에러', '이벤트 삭제 중 오류가 발생했습니다.');
    }
  };

  const confirmDelete = (eventId: string) => {
    Alert.alert('확인', '이벤트를 삭제하시겠습니까?', [
      {
        text: '취소',
        style: 'cancel',
      },
      {
        text: '확인',
        onPress: () => deleteEvent(eventId),
      },
    ]);
  };

  useFocusEffect(
    useCallback(() => {
      fetchEvents();
    }, []),
  );

  const getEventTitleStyle = (eventTitle: string) => {
    switch (eventTitle.trim().toLowerCase()) {
      case '결혼':
        return {backgroundColor: '#ffc0cb', color: '#fff'};
      case '생일':
        return {backgroundColor: '#97deb3', color: '#fff'};
      case '돌잔치':
        return {backgroundColor: '#87CEFA', color: '#fff'};
      case '장례식':
        return {backgroundColor: '#A9A9A9', color: '#fff'};
      default:
        return {backgroundColor: '#9aa160', color: '#fff'};
    }
  };
  const formatKoreanDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}년 ${
      date.getMonth() + 1
    }월 ${date.getDate()}일`;
  };
  const formatKoreanTime = (dateString: string) => {
    const date = new Date(dateString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    // Check if the time is 00:00:00, which indicates an all-day event
    if (hours === 3 && minutes === 33 && seconds === 33) {
      return '종일';
    }
    return `${hours}시 ${minutes}분`;
  };

  const renderItem = ({item}: {item: Event}) => {
    const pan = new Animated.ValueXY();
    const panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (e, gestureState) => {
        pan.setValue({x: gestureState.dx, y: 0});
      },
      onPanResponderRelease: (e, gestureState) => {
        if (gestureState.dx > 100) {
          Animated.spring(pan, {
            toValue: {x: 100, y: 0},
            useNativeDriver: false,
          }).start();
        } else if (gestureState.dx < -100) {
          Animated.spring(pan, {
            toValue: {x: -100, y: 0},
            useNativeDriver: false,
          }).start();
        } else {
          Animated.spring(pan, {
            toValue: {x: 0, y: 0},
            useNativeDriver: false,
          }).start();
        }
      },
    });

    return (
      <View style={styles.swipeContainer}>
        <Animated.View
          style={[
            styles.actionIconLeft,
            {
              opacity: pan.x.interpolate({
                inputRange: [50, 100],
                outputRange: [0, 1],
                extrapolate: 'clamp',
              }),
              left: 10,
            },
          ]}>
          <TouchableOpacity
            onPress={() => {
              setEventID(item.id);
              navigation.navigate(eventNavigations.EVENT_FIX, {
                event_id: item.id,
                category: item.category,
                name: item.name,
                eventTime: item.eventTime,
              });
            }}>
            <Icon name="pencil" size={24} color="#808080" />
          </TouchableOpacity>
        </Animated.View>

        <Animated.View
          style={[
            styles.actionIconRight,
            {
              opacity: pan.x.interpolate({
                inputRange: [-100, -50],
                outputRange: [1, 0],
                extrapolate: 'clamp',
              }),
              right: 10,
            },
          ]}>
          <TouchableOpacity onPress={() => confirmDelete(item.id)}>
            <Icon name="trash" size={24} color="#808080" />
          </TouchableOpacity>
        </Animated.View>

        <Animated.View
          style={[styles.eventContainer, {transform: [{translateX: pan.x}]}]}
          {...panResponder.panHandlers}>
          <TouchableOpacity
            style={styles.eventBox}
            onPress={() => {
              setEventID(item.id);
              navigation.navigate(eventNavigations.EVENT_DETAIL, {
                event_id: item.id,
                category: item.category,
                name: item.name,
                eventTime: item.eventTime,
              });
            }}>
            <View style={styles.eventRow}>
              {/* Here, category value is displayed without background */}
              <Text style={styles.eventName}>{item.category}</Text>
              {/* Event name with background */}
              <View style={[styles.eventTag, getEventTitleStyle(item.name)]}>
                <Text style={styles.eventTagText}>{item.name}</Text>
              </View>
            </View>
            <Text style={styles.eventDate}>
              {`${formatKoreanTime(item.eventTime)} `}
              <Text style={styles.separator}>|</Text> {/* Colored separator */}
              {` ${formatKoreanDate(item.eventTime)}`}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  };
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>로딩 중...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {events.length > 0 ? (
        <FlatList
          data={events}
          keyExtractor={item => item.id}
          renderItem={renderItem}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text>등록된 이벤트가 없습니다.</Text>
        </View>
      )}
      {/* <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate(eventNavigations.EVENT_ADD)}>
        <Icon name="add" size={28} color="#000" />
      </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  separator: {
    color: colors.GREEN_700,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  addButton: {
    position: 'absolute',
    top: 10,
    right: 16,
    zIndex: 1,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  swipeContainer: {
    marginBottom: 16,
    overflow: 'hidden',
  },
  eventContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderBottomWidth: 0.1,
    borderLeftWidth: 3, // 왼쪽 세로선 추가
    borderRightWidth: 3, // 오른쪽 세로선 추가
    borderLeftColor: '#d3d3d3', // 회색으로 설정
    borderRightColor: '#d3d3d3', // 회색으로 설정
  },
  eventBox: {
    padding: 12,
  },

  eventRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventName: {
    fontSize: 19,
    fontWeight: 'bold',
    flex: 1,
    color: '#333',
  },
  eventTag: {
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventTagText: {
    fontSize: 14,
    color: '#fff',
  },
  eventDate: {
    fontSize: 14,
    color: '#444',
    marginTop: 4,
  },
  actionIconLeft: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: 50,
  },
  actionIconRight: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: 50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default EventScreen;
