# Java 21 이미지 사용
FROM alpine/java:21-jdk

# 컨테이너 내 작업 디렉토리 설정
WORKDIR /app

# JAR 파일 복사
COPY module-api/build/libs/*.jar /app/module-api.jar

# 애플리케이션 실행
CMD ["java", "-jar", "/app/module-api.jar"]
