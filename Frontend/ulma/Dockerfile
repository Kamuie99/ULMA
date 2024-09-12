# 빌드 환경
FROM node:16-buster AS build

# 작업 디렉토리 설정
WORKDIR /app

# 패키지 복사
COPY . .

# 패키지 설치
RUN npm install

# gradlew 파일에 실행 권한 부여
RUN chmod +x android/gradlew

# APK 릴리즈 빌드
RUN cd android && ./gradlew assembleRelease
