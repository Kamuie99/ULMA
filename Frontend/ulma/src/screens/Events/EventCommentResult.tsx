import axiosInstance from '@/api/axios';
import TitleTextField from '@/components/common/TitleTextField';
import {colors} from '@/constants';
import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';

interface EventCommentResultProps {}

function EventCommentResult({}: EventCommentResultProps) {
  const [comments, setComments] = useState<string[]>([]);
  const eventName = '남자친구 생일';

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 여기에 비동기 작업 수행 (예: API 호출)
        // const response = await fetch('your-api-url');
        const response = await axiosInstance.get(
          '/auth/events/ai/recommend/message',
          {params: {eventName: eventName}}, // 쿼리 파라미터로 전달
        );
        // const data = await response.json();
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <TitleTextField
        frontLabel="AI가 추천하는"
        emphMsg="###"
        backLabel="메시지예요."
      />
      <View style={styles.commentContainer}>
        {/* {comments.map((comment, index) => (
          <Text key={index} style={styles.commentText}>
            {index + 1}. {comment}
          </Text>
        ))} */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  commentContainer: {
    flex: 1,
    backgroundColor: colors.LIGHTGRAY,
    margin: 20,
    borderRadius: 12,
  },
});

export default EventCommentResult;
