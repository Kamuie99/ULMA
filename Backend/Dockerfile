# 1단계: 빌드 환경
FROM alpine/java:21-jdk AS build

# 컨테이너 내 작업 디렉토리 설정
WORKDIR /app

# Gradle Wrapper 및 설정 파일 복사 (의존성 캐싱용)
COPY .gradle/ .gradle/
COPY gradle/ gradle/
COPY gradlew ./
COPY settings.gradle ./
COPY build.gradle ./

# 멀티 모듈 프로젝트 소스 코드 복사
COPY module-api/ module-api/
COPY module-common/ module-common/

# Gradle 의존성 미리 설치
RUN ./gradlew dependencies --no-daemon

# 프로젝트 빌드
RUN ./gradlew :module-api:bootJar --no-daemon

# 2단계: 실제 실행 환경
FROM alpine/java:21-jdk

# 컨테이너 내 작업 디렉토리 설정
WORKDIR /app

# 1단계에서 생성된 JAR 파일 복사
COPY --from=build /app/module-api/build/libs/module-api.jar /app/module-api.jar

# 애플리케이션 실행 포트 설정
EXPOSE 8000

# JAR 파일 실행 설정
CMD ["java", "-jar", "/app/module-api.jar"]
