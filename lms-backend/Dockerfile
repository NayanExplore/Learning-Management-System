FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /workspace
COPY pom.xml .
COPY mvnw.cmd .
COPY src ./src
# Install maven and package
RUN apk add --no-cache maven
RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=builder /workspace/target/lms-backend-1.0.0.jar app.jar
RUN mkdir -p /app/data/uploads
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
