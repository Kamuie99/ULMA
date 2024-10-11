import axiosInstance from '@/api/axios';

const searchGuestID = async (names: string[]) => {
  for (const name of names) {
    try {
      const response = await axiosInstance.get('/participant/same', {
        params: {name: name},
      });

      if (response.data && response.data.data.length > 0) {
        const guestID = response.data.data[0].guestId;
        return {guestID, name};
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log(`${name}는 검색 결과가 없습니다. 404 pass.`);
      } else {
        console.error('오류 발생:', error);
        break;
      }
    }
  }

  return null;
};

const parseOCRData = async (ocrText: string) => {
  const lines = ocrText.split('\n');

  const dateRegex = /\d{4}년 \d{1,2}월 \d{1,2}일/;
  const timeRegex = /(오전|오후) \d{1,2}시/;

  const dateMatch = lines.find(line => dateRegex.test(line));
  const timeMatch = lines.find(line => timeRegex.test(line));

  const nameLine = lines.find(line => line.includes('-'));
  const names = nameLine ? nameLine.split('-').map(name => name.trim()) : [];
  const guestInfo = await searchGuestID(names); // 비동기 호출

  let eventDate: Date | null = null;
  let eventTime: Date | null = null;

  if (dateMatch) {
    const dateString = dateMatch.match(dateRegex)?.[0];
    if (dateString) {
      const [year, month, day] = dateString
        .replace('년', '')
        .replace('월', '')
        .replace('일', '')
        .trim()
        .split(' ')
        .map(Number);
      eventDate = new Date(year, month - 1, day);
    }
  }

  if (timeMatch) {
    const timeString = timeMatch.match(timeRegex)?.[0];
    if (timeString) {
      const [meridiem, hour] = timeString.split(' ');
      let hourValue = parseInt(hour.replace('시', ''), 10);
      if (meridiem === '오후' && hourValue < 12) hourValue += 12;
      eventTime = new Date();
      eventTime.setHours(hourValue, 0, 0);
    }
  }

  return {date: eventDate, time: eventTime, guestInfo};
};

export default parseOCRData;
