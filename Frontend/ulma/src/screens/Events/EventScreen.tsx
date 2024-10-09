import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Animated,
  PanResponder,
} from 'react-native';
import {NavigationProp, useFocusEffect} from '@react-navigation/native';
import axiosInstance from '@/api/axios';
import {eventNavigations} from '@/constants/navigations';
import Icon from 'react-native-vector-icons/Ionicons';
import useEventStore from '@/store/useEventStore';
import {colors} from '@/constants';
import AwesomeAlert from 'react-native-awesome-alerts';
import EventTag from '@/components/common/EventTag';
import Toast from 'react-native-toast-message';

interface Event {
  id: string;
  category: string;
  name: string;
  eventTime: string;
}

const EventScreen = ({navigation}: {navigation: NavigationProp<any>}) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertTitle, setAlertTitle] = useState<string>('');
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [eventIdToDelete, setEventIdToDelete] = useState<string | null>(null);
  const {setEventInfo} = useEventStore();

  const fetchEvents = async () => {
    try {
      const response = await axiosInstance.get('/events');
      setEvents(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('이벤트 목록을 불러오는 중 오류 발생:', error);
      Toast.show({
        type: 'error',
        text1: '목록 불러오기에 실패했어요.',
      });
    }
  };

  const deleteEvent = async (eventId: string) => {
    try {
      await axiosInstance.delete(`/events/${eventId}`);
      setAlertTitle('완료');
      setAlertMessage('이벤트가 삭제되었습니다.');
      setShowAlert(true);
      fetchEvents();
    } catch (error) {
      console.error('이벤트 삭제 중 오류 발생:', error);
      setAlertTitle('실패');
      setAlertMessage('이벤트 삭제 중 오류가 발생했습니다.');
      setShowAlert(true);
    }
  };

  const confirmDelete = (eventId: string) => {
    setEventIdToDelete(eventId);
    setAlertTitle('확인');
    setAlertMessage('이벤트를 삭제하시겠습니까?');
    setShowAlert(true);
  };

  const handleAlertConfirm = () => {
    if (eventIdToDelete) {
      deleteEvent(eventIdToDelete);
      setEventIdToDelete(null);
    }
    setShowAlert(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchEvents();
    }, []),
  );

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
              useEventStore
                .getState()
                .setEventInfo(
                  item.id,
                  item.category,
                  item.name,
                  item.eventTime,
                );
              navigation.navigate(eventNavigations.EVENT_DETAIL, {
                event_id: item.id,
                category: item.category,
                name: item.name,
                eventTime: item.eventTime,
              });
            }}>
            <View style={styles.eventRow}>
              <Text style={styles.eventName}>{item.category}</Text>
              <EventTag label={item.name} />
            </View>
            <Text style={styles.eventDate}>
              {`${formatKoreanTime(item.eventTime)} `}
              <Text style={styles.separator}>|</Text>
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
      <AwesomeAlert
        show={showAlert}
        showProgress={false}
        title={alertTitle}
        message={alertMessage}
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
        showCancelButton={eventIdToDelete !== null}
        showConfirmButton={true}
        cancelText="취소"
        confirmText="확인"
        confirmButtonColor="#DD6B55"
        onCancelPressed={() => setShowAlert(false)}
        onConfirmPressed={handleAlertConfirm}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  separator: {
    color: colors.GREEN_300,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  swipeContainer: {
    marginBottom: 16,
    overflow: 'hidden',
  },
  eventContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.GRAY_300,
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
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    color: colors.BLACK,
  },
  eventDate: {
    fontSize: 14,
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
