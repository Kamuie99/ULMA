import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import axios from 'axios';
import CustomButton from '@/components/common/CustomButton';
import fs from 'react-native-fs'; // 파일을 읽기 위한 모듈
import Toast from 'react-native-toast-message';

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
      Toast.show({
        text1: '이미지를 선택해주세요.',
        type: 'error',
      });
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
                type: 'DOCUMENT_TEXT_DETECTION',
              },
            ],
          },
        ],
      };
      const apiCall = `https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`;
      const response = await axios.post(apiCall, reqObj);
      console.log('API Response:', response.data);
      if (response.data.responses[0].textAnnotations) {
        Toast.show({
          text1: '이미지 읽어오기 성공',
          type: 'success',
        });
        console.log(response.data.responses[0].textAnnotations[0]);
      } else {
        Toast.show({
          text1: '이미지 읽어오기 실패',
          type: 'error',
        });
      }
    } catch (error) {
      console.error('Error processing image:', error);
      Toast.show({
        text1: '이미지 읽어오기 실패',
        type: 'error',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <View style={styles.container}>
      {imageUri ? (
        <>
          {/* 이미지를 눌러서 다시 선택할 수 있도록 설정 */}
          <TouchableOpacity onPress={selectImage}>
            <Image source={{uri: imageUri}} style={styles.image} />
          </TouchableOpacity>
          <CustomButton
            label="확인"
            posY={30}
            onPress={processImage}
            disabled={isProcessing}
          />
        </>
      ) : (
        <CustomButton label="이미지 선택" posY={30} onPress={selectImage} />
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
