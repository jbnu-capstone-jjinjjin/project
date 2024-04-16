FROM openjdk:21-slim
ARG JAR_FILE=build/libs/*.jar
COPY ${JAR_FILE} capstone-0.0.1-SNAPSHOT.jar
ENTRYPOINT ["java","-jar","capstone-0.0.1-SNAPSHOT.jar"]