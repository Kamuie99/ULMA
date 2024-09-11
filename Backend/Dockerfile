# 1단계: 빌드 환경
FROM alpine/java:21-jdk AS build

# 컨테이너 내 작업 디렉토리 설정
WORKDIR /app

# 빌드에 필요한 파일 복사
COPY . .

# gradlew 실행 권한 부여
RUN chmod +x gradlew

# 빌드
RUN ./gradlew build --no-daemon

# 2단계: 실제 실행 환경
FROM alpine/java:21-jdk

# 컨테이너 내 작업 디렉토리 설정
WORKDIR /app

# 1단계에서 생성된 JAR 파일 복사 (module-api의 실행 가능한 JAR 파일)
COPY --from=build /app/module-api/build/libs/module-api.jar /app/module-api.jar

# 애플리케이션 실행 포트 설정
EXPOSE 8000

# JAR 파일 실행 설정
CMD ["java", "-jar", "/app/module-api.jar"]
