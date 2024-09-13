# Java 21 이미지 사용
FROM alpine/java:21-jdk

# JAR 파일 복사
COPY module-api/build/libs/module-api-0.0.1-SNAPSHOT-plain.jar /app/module-api.jar

# 애플리케이션 실행
CMD ["java", "-jar", "/app/module-api.jar"]
