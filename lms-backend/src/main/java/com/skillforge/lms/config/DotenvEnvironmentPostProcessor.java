package com.skillforge.lms.config;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;
import org.springframework.core.env.StandardEnvironment;

import java.io.File;
import java.util.HashMap;
import java.util.Map;

/**
 * Standard Spring Boot EnvironmentPostProcessor that automatically loads
 * environment variables from a .env file using dotenv-java during Spring Boot startup,
 * keeping LmsApplication free of custom loader logic.
 */
@Order(Ordered.HIGHEST_PRECEDENCE)
public class DotenvEnvironmentPostProcessor implements EnvironmentPostProcessor {

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        String[] candidateDirs = {".", "..", "../.."};
        Dotenv dotenv = null;

        for (String dir : candidateDirs) {
            File file = new File(dir, ".env");
            if (file.exists() && file.isFile()) {
                try {
                    dotenv = Dotenv.configure()
                            .directory(dir)
                            .ignoreIfMissing()
                            .load();
                    break;
                } catch (Exception ignored) {
                }
            }
        }

        if (dotenv != null) {
            Map<String, Object> envMap = new HashMap<>();
            dotenv.entries().forEach(entry -> {
                envMap.put(entry.getKey(), entry.getValue());
                if (System.getProperty(entry.getKey()) == null && System.getenv(entry.getKey()) == null) {
                    System.setProperty(entry.getKey(), entry.getValue());
                }
            });

            if (environment.getPropertySources().contains(StandardEnvironment.SYSTEM_ENVIRONMENT_PROPERTY_SOURCE_NAME)) {
                environment.getPropertySources().addAfter(
                        StandardEnvironment.SYSTEM_ENVIRONMENT_PROPERTY_SOURCE_NAME,
                        new MapPropertySource("dotenvProperties", envMap));
            } else {
                environment.getPropertySources().addFirst(new MapPropertySource("dotenvProperties", envMap));
            }
        }
    }
}
