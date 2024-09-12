# 빌드 환경
FROM node:16-buster AS build

# 작업 디렉토리 설정
WORKDIR /app

# package.json과 package-lock.json을 복사
COPY package*.json ./

# 패키지 설치
RUN npm install

# 프로젝트 소스 복사
COPY . .

# gradlew 파일에 실행 권한 부여
RUN chmod +x android/gradlew

# APK 릴리즈 빌드
RUN cd android && ./gradlew assembleRelease
