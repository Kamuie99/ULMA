import React, {useState, useCallback} from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import axios from 'axios';
import CustomButton from '@/components/common/CustomButton';
import fs from 'react-native-fs';
import Toast from 'react-native-toast-message';
import parseOCRData from '@/utils/parseOCRData';
import useEventStore from '@/store/useEventStore';
import {homeNavigations} from '@/constants/navigations';
import {useNavigation} from '@react-navigation/native';

const API_KEY = ''; // Google Vision API 키

const ImageOCRScreen = () => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigation = useNavigation();

  const {setNewEventInfo} = useEventStore(); // Zustand 스토어 사용 위치 변경

  const selectImage = useCallback(() => {
    launchImageLibrary({mediaType: 'photo'}, response => {
      if (response.didCancel) {
        console.log('Image selection cancelled');
      } else if (response.errorCode) {
        console.log('Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const selectedImageUri = response.assets[0].uri;
        setImageUri(selectedImageUri);
      }
    });
  }, []);

  const base64_encode = useCallback(
    async (fileUri: string): Promise<string> => {
      try {
        return await fs.readFile(fileUri, 'base64');
      } catch (error) {
        console.error('Failed to encode file to base64:', error);
        throw error;
      }
    },
    [],
  );

  const processImage = useCallback(async () => {
    if (!imageUri) {
      Toast.show({text1: '이미지를 선택해주세요.', type: 'error'});
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
      if (response.data.responses[0].textAnnotations) {
        Toast.show({text1: '이미지 읽어오기 성공', type: 'success'});
        const ocrText =
          response.data.responses[0].textAnnotations[0].description;
        const {date, time, guestInfo} = await parseOCRData(ocrText);
        setNewEventInfo(
          date ? date.toISOString().split('T')[0] : null,
          time ? time.toISOString() : null,
          guestInfo?.name,
          guestInfo?.guestID ? guestInfo.guestID.toString() : null,
        );
        navigation.navigate(homeNavigations.SCHEDULE_ADD);
      } else {
        Toast.show({text1: '이미지 읽어오기 실패', type: 'error'});
      }
    } catch (error) {
      console.error('Error processing image:', error);
      Toast.show({text1: '이미지 읽어오기 실패', type: 'error'});
    } finally {
      setIsProcessing(false);
    }
  }, [imageUri, setNewEventInfo, base64_encode]);

  return (
    <View style={styles.container}>
      {imageUri ? (
        <>
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
