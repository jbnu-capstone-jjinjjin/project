FROM openjdk:21-slim AS build
WORKDIR /workspace/app

COPY gradlew build.gradle settings.gradle ./
COPY gradle gradle
COPY src src

RUN apt-get update && apt-get install -y dos2unix
RUN dos2unix ./gradlew && chmod +x ./gradlew

RUN ./gradlew build -x test

FROM openjdk:21-slim
ENV TZ=Asia/Seoul
COPY --from=build /workspace/app/build/libs/*.jar capstone.jar
ENTRYPOINT ["java","-jar","/capstone.jar"]
