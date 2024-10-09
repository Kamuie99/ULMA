import axios from 'axios';
import fs from 'fs';

const API_KEY = '[GOOGLE_VISION_API_KEY]';

if (!API_KEY) {
  console.error('No API key provided');
  process.exit(1); // API key가 없으면 실행 중단
}

// 파일을 base64로 인코딩하는 함수
function base64_encode(file: string): string {
  const bitmap = fs.readFileSync(file);
  return Buffer.from(bitmap).toString('base64');
}

// 파일 경로를 넣어서 base64 문자열을 생성
const base64str: string = base64_encode('test_image.jpg');

// Google Vision API 호출 URL
const apiCall: string = `https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`;

// 요청 객체
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

// Google Vision API 호출
axios
  .post(apiCall, reqObj)
  .then(response => {
    console.log('API Response:');
    console.log(JSON.stringify(response.data.responses, undefined, 4));
  })
  .catch(error => {
    if (error.response) {
      console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('No response from API:', error.request);
    } else {
      console.error('Error setting up API request:', error.message);
    }
  });
