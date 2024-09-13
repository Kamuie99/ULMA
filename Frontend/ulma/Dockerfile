# 빌드 환경
FROM node:16-buster AS build

# Java 17 설치
RUN apt-get update && apt-get install -y openjdk-17-jdk

# 환경 변수 설정
ENV JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
ENV PATH=$JAVA_HOME/bin:$PATH

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
