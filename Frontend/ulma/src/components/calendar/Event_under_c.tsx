import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';

// EventType 정의
interface EventType {
  date: string;
  title: string;
  type: string;
}

const EventBox = ({date, title, type}: EventType) => {
  const [isEditing, setIsEditing] = useState(false); // 수정 모드 여부
  const [editableTitle, setEditableTitle] = useState(title); // 수정 가능한 제목 상태
  const [editableDate, setEditableDate] = useState(date); // 수정 가능한 날짜 상태
  const [editableType, setEditableType] = useState(type); // 수정 가능한 타입 상태

  const toggleEdit = () => {
    setIsEditing(!isEditing); // 수정 모드 토글
  };

  return (
    <TouchableOpacity onPress={toggleEdit}>
      <View style={styles.eventBox}>
        {isEditing ? (
          <View>
            <TextInput
              style={styles.input}
              value={editableDate}
              onChangeText={setEditableDate}
            />
            <TextInput
              style={styles.input}
              value={editableTitle}
              onChangeText={setEditableTitle}
            />
            <TextInput
              style={styles.input}
              value={editableType}
              onChangeText={setEditableType}
            />
          </View>
        ) : (
          <View>
            <Text style={styles.date}>{editableDate}</Text>
            <View style={styles.eventDetails}>
              <Text style={styles.eventTitle}>{editableTitle}</Text>
              <View style={styles.typeBox}>
                <Text style={styles.eventType}>{editableType}</Text>
              </View>
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  eventBox: {
    backgroundColor: '#ffffff', // 흰색 배경
    padding: 16,
    borderRadius: 10, // 둥근 모서리
    borderColor: '#e0e0e0', // 얇은 회색 경계선
    borderWidth: 1, // 경계선 두께
    marginTop: 16,
    shadowColor: '#000', // 그림자
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: {width: 0, height: 2},
    elevation: 3, // Android 그림자
  },
  date: {
    fontSize: 12,
    color: '#888', // 상단 작은 글씨
    marginBottom: 8,
  },
  eventDetails: {
    flexDirection: 'row', // 제목과 타입을 나란히 배치
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventTitle: {
    fontSize: 16, // 큰 글씨
    fontWeight: 'bold', // 굵은 글씨
    color: '#000', // 검정색 텍스트
  },
  typeBox: {
    backgroundColor: '#cce5ff', // 파란색 배경
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
  },
  eventType: {
    color: '#0056b3', // 파란색 글씨
    fontSize: 12,
    fontWeight: 'bold',
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginBottom: 8,
    fontSize: 16,
    padding: 4,
  },
});

export default EventBox;
