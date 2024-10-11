## 프론트엔드
- React Native
    
     `ver0.74`
    

- Android Studio
    
    <aside>
    
    가상 모바일 환경을 설치해 확인하는 용도
    
    </aside>
    
    1. Choco 설치 (https://chocolatey.org/)
    2. Android Studio 설치
    3. Device: `Pixel 5 Tiramisu(API33)`
    4. SDK Platform: `Inter x86_64 Atom System Image (ver13, ver14)`
    5. SDK Tools: `Google Play Service`
    6. 환경 변수 설정 (https://reactnative.dev/docs/0.74/set-up-your-environment)

- 프로젝트 실행 (안드로이드 스튜디오 켜져 있어야 함!!)
    
    ```bash
    npm i
    
    # 1. npm start
    npm start
    # 안드로이드 폰 실행
    a 
    
    # 2. npx
    npx react-native run-android
    ```

## 백엔드
- 자바 
    jdk : 21

- build.gradle(module-common build.graldle)
    ```java
    import org.gradle.api.services.BuildServiceParameters;
    import org.gradle.api.services.BuildService;
    import org.testcontainers.containers.MySQLContainer;
    import java.nio.file.Paths;

    buildscript {
        repositories {
            mavenCentral()
        }
        dependencies {
            classpath 'org.testcontainers:testcontainers:1.19.8'
            classpath 'org.testcontainers:mysql:1.19.8'
            classpath 'mysql:mysql-connector-java:8.0.33'
        }
    }

    plugins {
        id 'nu.studer.jooq' version '9.0'
        id "org.sonarqube" version "5.0.0.4638"
    }

    dependencies {
        implementation 'org.springframework.boot:spring-boot-starter-jooq'

        implementation 'org.jooq:jooq:3.19.11'
        implementation 'org.jooq:jooq-codegen:3.19.11'
        jooqGenerator 'org.jooq:jooq-meta:3.19.11'
        implementation 'org.springframework.boot:spring-boot-starter-validation'
        implementation 'mysql:mysql-connector-java:8.0.33'
        runtimeOnly 'com.mysql:mysql-connector-j'
        jooqGenerator 'com.mysql:mysql-connector-j'
        runtimeOnly 'com.h2database:h2'

        implementation 'org.testcontainers:testcontainers'
        implementation 'org.testcontainers:mysql'

        testImplementation 'org.springframework.boot:spring-boot-testcontainers'
        testImplementation 'org.testcontainers:junit-jupiter'
    }

    Provider<MySqlService> dbContainerProvider = project.getGradle()
            .getSharedServices()
            .registerIfAbsent("mysql", MySqlService.class, spec -> {
                spec.getParameters().getSchemaFilePath().set(
                        Paths.get(project.getProjectDir().toString(), "src", "main", "resources", "schema.sql").toString()
                );
            });

    jooq {
        configurations {
            main {
                generationTool {
                    logging = org.jooq.meta.jaxb.Logging.WARN

                    def dbContainer = dbContainerProvider.get().getContainer()
                    jdbc {
                        driver = 'com.mysql.cj.jdbc.Driver'
                        url = dbContainer.jdbcUrl
                        user = dbContainer.username
                        password = dbContainer.password
                    }

                    generator {
                        name = 'org.jooq.codegen.DefaultGenerator'
                        database {
                            name = 'org.jooq.meta.mysql.MySQLDatabase'
                            inputSchema = 'ulma'
                        }
                        generate {
                            deprecated = false
                            records = true
                            immutablePojos = true
                            fluentSetters = true
                        }
                        target {
                            packageName = 'com.ssafy11.ulma.generated'
                            directory = 'build/generated-src/jooq/main'
                        }
                    }
                }
            }
        }
    }


    test {
        useJUnitPlatform()
        systemProperty 'org.testcontainers', 'DEBUG'

        usesService dbContainerProvider
        doFirst {
            def dbContainer = dbContainerProvider.get().container
            systemProperty('spring.datasource.url', dbContainer.jdbcUrl)
            systemProperty('spring.datasource.username', dbContainer.username)
            systemProperty('spring.datasource.password', dbContainer.password)
        }
    }

    bootJar.enabled = false
    jar.enabled = true

    sonar {
        properties {
            property "sonar.projectKey", "s11-fintech-finance-sub1_S11P21E204_bcdede1e-ca0a-452b-9519-bb727bd39561"
            property "sonar.projectName", "S11P21E204"
        }
    }

    abstract class MySqlService implements BuildService<MySqlService.Params>, AutoCloseable {

        interface Params extends BuildServiceParameters {
            Property<String> getSchemaFilePath();  // Property<String> 사용
        }

        private final MySQLContainer<?> container;

        MySqlService() {
            container = new MySQLContainer<>("mysql:8.0.33")
                    .withDatabaseName("ulma")
                    .withUsername("root")
                    .withPassword("1234");
            container.start();

            String schemaFilePath = getParameters().getSchemaFilePath().get();  // get() 메서드로 값 가져옴
            File schemaFile = new File(schemaFilePath);

            if (schemaFile.exists()) {
                container.copyFileToContainer(
                        org.testcontainers.utility.MountableFile.forHostPath(schemaFilePath),
                        "/schema.sql"
                );
                container.execInContainer("mysql", "-u", "root", "-p1234", "ulma", "-e", "source /schema.sql");
            }
        }

        @Override
        public void close() {
            container.stop();
        }

        public MySQLContainer<?> getContainer() {
            return container;
        }
    }
    ```

- application-common.yml(module-common 폴더에 위치)
    ```yml
    spring:
        datasource:
        driver-class-name: com.mysql.cj.jdbc.Driver
        username: {username}
        password: {userpassword}
        url: jdbc:mysql://j11e204.p.ssafy.io:3306/ulma
    ```

- application-auth.yml(module-common 폴더에 위치)
    ```yml
    jwt:
        secret:
            key: {jwt key}
            expiration: 31536000
        refresh:
            key: {jwt key}
            expiration: 31536000
    ###
    spring:
        mail:
            host: smtp.gmail.com
            port: 587
            username: ulma.e204@gmail.com
            password: whns lfpg kxur huhk
            properties:
            mail:
                smtp:
                auth: true
                starttls:
                    enable: true
                    required: true
                timeout: 5000
    # =====================
    # Redis Configuration
    # =====================
    datasource:
        driver-class-name: com.mysql.cj.jdbc.Driver
        username: {username}
        password: {userpassword}
        url: jdbc:mysql://j11e204.p.ssafy.io:3306/ulma

    data:
        redis:
        host: j11e204.p.ssafy.io
        port: 6379
    ###
    sms:
        key: {sms key}
        secret-key: {sms key}
    ```

- application-api.yml(module-api 폴더에 위치)
    ```yml
    spring:
      profiles:
        include: auth
        active: local

    ### gpt
    openai:
      api-key: {chat gpt api key}
      api-message: " 다른 말 없이 경조사 메세지 3개만 제공해줘"
      api-amount: " 다른 말 없이 평균적인 경조사비 금액만 말해줘"
    ```

