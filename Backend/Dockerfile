# 1단계: 빌드 환경
FROM alpine/java:21-jdk AS build

# Build-time arguments (MySQL 정보)
ARG MYSQL_ROOT_PASSWORD
ARG MYSQL_DATABASE
ARG MYSQL_USER
ARG MYSQL_PASSWORD
ARG MYSQL_REPLICATION_USER
ARG MYSQL_REPLICATION_PASSWORD

# Run-time environment variables (optional)
ENV MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD}
ENV MYSQL_DATABASE=${MYSQL_DATABASE}
ENV MYSQL_USER=${MYSQL_USER}
ENV MYSQL_PASSWORD=${MYSQL_PASSWORD}
ENV MYSQL_REPLICATION_USER=${MYSQL_REPLICATION_USER}
ENV MYSQL_REPLICATION_PASSWORD=${MYSQL_REPLICATION_PASSWORD}

# 컨테이너 내 작업 디렉토리 설정
WORKDIR /app

# 빌드에 필요한 파일 복사
COPY . .

# MySQL 환경 변수들을 빌드에서 사용
RUN echo "Building with MySQL root password: ${MYSQL_ROOT_PASSWORD}" && \
    echo "MySQL Database: ${MYSQL_DATABASE}" && \
    echo "MySQL User: ${MYSQL_USER}" && \
    echo "MySQL Password: ${MYSQL_PASSWORD}" && \
    echo "MySQL Replication User: ${MYSQL_REPLICATION_USER}" && \
    echo "MySQL Replication Password: ${MYSQL_REPLICATION_PASSWORD}"

# gradlew 실행 권한 부여
RUN chmod +x gradlew

RUN ./gradlew generateJooq

# 빌드
RUN ./gradlew build --no-daemon --info

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
