# 1단계: 빌드 환경
FROM alpine/java:21-jdk AS build

# 컨테이너 내 작업 디렉토리 설정
WORKDIR /app

# Gradle Wrapper 및 설정 파일 복사 (의존성 캐싱용)
COPY gradle/ gradle/
COPY gradlew ./gradlew
COPY settings.gradle ./ 
COPY build.gradle ./
COPY module-common/build.gradle module-common/
COPY module-api/build.gradle module-api/

# 멀티 모듈 프로젝트 소스 코드 복사
COPY module-api/ module-api/
COPY module-common/ module-common/

# gradlew 파일에 실행 권한 부여
RUN chmod +x gradlew

# Gradle 의존성 미리 설치
RUN ./gradlew dependencies --no-daemon --stacktrace

# 전체 프로젝트 빌드 (module-common도 함께 빌드됨)
RUN ./gradlew build --no-daemon --stacktrace

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
