import React, {useState} from 'react';
import {StyleSheet, View, Text, Image, Alert} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import axios from 'axios';
import CustomButton from '@/components/common/CustomButton';
import fs from 'react-native-fs'; // 파일을 읽기 위한 모듈

const API_KEY = ''; // Google Vision API 키

const ImageOCRScreen = () => {
  const [imageUri, setImageUri] = useState<string | null>(null); // 선택한 이미지 URI
  const [isProcessing, setIsProcessing] = useState(false); // 이미지 처리 중 상태
  // 이미지 선택 함수
  const selectImage = () => {
    launchImageLibrary({mediaType: 'photo'}, async response => {
      if (response.didCancel) {
        console.log('Image selection cancelled');
      } else if (response.errorCode) {
        console.log('Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const selectedImageUri = response.assets[0].uri;
        if (selectedImageUri) {
          setImageUri(selectedImageUri); // 이미지 URI 설정
        }
      }
    });
  };
  // base64로 이미지를 인코딩하는 함수
  const base64_encode = async (fileUri: string): Promise<string> => {
    try {
      const fileContent = await fs.readFile(fileUri, 'base64');
      return fileContent;
    } catch (error) {
      console.error('Failed to encode file to base64:', error);
      throw error;
    }
  };
  // Google Vision API로 이미지 처리하는 함수
  const processImage = async () => {
    if (!imageUri) {
      Alert.alert('오류', '먼저 이미지를 선택하세요.');
      return;
    }
    setIsProcessing(true);
    try {
      const base64str = await base64_encode(imageUri);
      const reqObj = {
        requests: [
          {
            image: {
              content: base64str,
            },
            features: [
              {
                type: 'DOCUMENT_TEXT_DETECTION', // 텍스트 감지 기능
              },
            ],
          },
        ],
      };
      const apiCall = `https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`;
      const response = await axios.post(apiCall, reqObj);
      console.log('API Response:', response.data);
      // 처리 결과에 따른 알림 표시
      if (response.data.responses[0].textAnnotations) {
        Alert.alert('성공', '텍스트를 감지했습니다.');
        console.log(response.data.responses[0].textAnnotations[0]);
      } else {
        Alert.alert('실패', '텍스트를 인식하지 못했습니다. 다시 시도하세요.');
      }
    } catch (error) {
      console.error('Error processing image:', error);
      Alert.alert('에러', '이미지를 처리하는 중 오류가 발생했습니다.');
    } finally {
      setIsProcessing(false);
    }
  };
  return (
    <View style={styles.container}>
      <CustomButton
        label="이미지 선택"
        variant="outlined"
        onPress={selectImage}
      />
      {imageUri && (
        <View>
          <Image source={{uri: imageUri}} style={styles.image} />
          <CustomButton
            label="확인"
            variant="contained"
            onPress={processImage}
            disabled={isProcessing}
          />
        </View>
      )}
      {!imageUri && <Text>이미지를 선택해주세요.</Text>}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 20,
    resizeMode: 'contain',
  },
});

export default ImageOCRScreen;
