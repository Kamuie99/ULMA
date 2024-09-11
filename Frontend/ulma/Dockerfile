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

# React Native Web 빌드
RUN npm run build

# Nginx 사용해 웹 서버로 배포
FROM nginx:alpine

# 빌드된 웹 파일을 Nginx로 복사
COPY --from=build /app/build /usr/share/nginx/html

# Nginx 포트 노출
EXPOSE 80

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]
