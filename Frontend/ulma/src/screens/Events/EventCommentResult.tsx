import axiosInstance from '@/api/axios';
import TitleTextField from '@/components/common/TitleTextField';
import {colors} from '@/constants';
import useAuthStore from '@/store/useAuthStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';

interface EventCommentResultProps {}

function EventCommentResult({}: EventCommentResultProps) {
  const {accessToken} = useAuthStore();
  const [comments, setComments] = useState<string[]>([]);
  const eventName = '남자친구 생일';

  // 페이지에 입장하면 멘트 요청 보냄
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.post(
          '/events/ai/recommend/message',
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            params: {gptQuotes: eventName},
          },
        );
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
