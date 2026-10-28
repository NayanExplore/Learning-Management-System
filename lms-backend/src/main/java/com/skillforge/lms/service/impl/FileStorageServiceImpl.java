package com.skillforge.lms.service.impl;

import com.skillforge.lms.config.AppProperties;
import com.skillforge.lms.service.FileStorageService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Duration;

@Service
@Slf4j
public class FileStorageServiceImpl implements FileStorageService {

    private final AppProperties appProperties;
    private S3Client s3Client;
    private S3Presigner s3Presigner;
    private boolean useAwsS3 = false;
    private final Path localBaseDir = Paths.get("data", "uploads");

    public FileStorageServiceImpl(AppProperties appProperties) {
        this.appProperties = appProperties;
    }

    @PostConstruct
    public void init() {
        var aws = appProperties.getAws();
        if (StringUtils.hasText(aws.getAccessKey()) && StringUtils.hasText(aws.getSecretKey())) {
            try {
                var creds = StaticCredentialsProvider.create(
                        AwsBasicCredentials.create(aws.getAccessKey(), aws.getSecretKey()));
                Region region = Region.of(aws.getRegion());

                this.s3Client = S3Client.builder()
                        .credentialsProvider(creds)
                        .region(region)
                        .build();

                this.s3Presigner = S3Presigner.builder()
                        .credentialsProvider(creds)
                        .region(region)
                        .build();

                this.useAwsS3 = true;
                log.info("Initialized AWS S3 FileStorageService targeting bucket '{}' in region '{}'",
                        aws.getS3().getBucket(), aws.getRegion());
            } catch (Exception ex) {
                log.warn("Failed to initialize AWS S3 client: {}. Falling back to local storage.", ex.getMessage());
            }
        }

        if (!useAwsS3) {
            log.info("AWS S3 credentials not provided. Using secure local file storage at '{}'", localBaseDir.toAbsolutePath());
            try {
                Files.createDirectories(localBaseDir);
            } catch (Exception e) {
                log.error("Could not create local storage directory", e);
            }
        }
    }

    @Override
    public String uploadFile(String key, InputStream inputStream, long contentLength, String contentType) {
        if (useAwsS3) {
            try {
                PutObjectRequest putReq = PutObjectRequest.builder()
                        .bucket(appProperties.getAws().getS3().getBucket())
                        .key(key)
                        .contentType(contentType)
                        .build();
                s3Client.putObject(putReq, RequestBody.fromInputStream(inputStream, contentLength));
                log.debug("Successfully uploaded file to S3 with key '{}'", key);
                return key;
            } catch (Exception e) {
                log.error("Failed to upload to S3: {}", e.getMessage(), e);
                throw new RuntimeException("Storage upload failed: " + e.getMessage(), e);
            }
        } else {
            try {
                Path targetPath = localBaseDir.resolve(key).normalize();
                if (!targetPath.startsWith(localBaseDir)) {
                    throw new SecurityException("Path traversal attempt detected");
                }
                Files.createDirectories(targetPath.getParent());
                try (var out = new FileOutputStream(targetPath.toFile())) {
                    inputStream.transferTo(out);
                }
                log.debug("Saved file locally at '{}'", targetPath);
                return key;
            } catch (Exception e) {
                log.error("Failed to save local file: {}", e.getMessage(), e);
                throw new RuntimeException("Local storage failed: " + e.getMessage(), e);
            }
        }
    }

    @Override
    public String getPresignedUrl(String key) {
        if (useAwsS3) {
            try {
                int expiryMinutes = appProperties.getAws().getS3().getPresignedUrlExpiryMinutes();
                GetObjectRequest getReq = GetObjectRequest.builder()
                        .bucket(appProperties.getAws().getS3().getBucket())
                        .key(key)
                        .build();
                GetObjectPresignRequest presignReq = GetObjectPresignRequest.builder()
                        .signatureDuration(Duration.ofMinutes(expiryMinutes))
                        .getObjectRequest(getReq)
                        .build();
                return s3Presigner.presignGetObject(presignReq).url().toString();
            } catch (Exception e) {
                log.error("Failed to generate presigned S3 URL: {}", e.getMessage());
                return null;
            }
        } else {
            // Return internal download URL
            return appProperties.getApiBaseUrl() + "/v1/files/download?key=" + key;
        }
    }

    @Override
    public byte[] getFileBytes(String key) {
        if (useAwsS3) {
            try {
                GetObjectRequest getReq = GetObjectRequest.builder()
                        .bucket(appProperties.getAws().getS3().getBucket())
                        .key(key)
                        .build();
                return s3Client.getObject(getReq).readAllBytes();
            } catch (Exception e) {
                log.error("Failed to read file from S3: {}", e.getMessage());
                return null;
            }
        } else {
            try {
                Path targetPath = localBaseDir.resolve(key).normalize();
                if (!targetPath.startsWith(localBaseDir) || !Files.exists(targetPath)) {
                    return null;
                }
                return Files.readAllBytes(targetPath);
            } catch (Exception e) {
                log.error("Failed to read local file: {}", e.getMessage());
                return null;
            }
        }
    }

    @Override
    public void deleteFile(String key) {
        if (useAwsS3) {
            try {
                DeleteObjectRequest deleteReq = DeleteObjectRequest.builder()
                        .bucket(appProperties.getAws().getS3().getBucket())
                        .key(key)
                        .build();
                s3Client.deleteObject(deleteReq);
            } catch (Exception e) {
                log.error("Failed to delete file from S3: {}", e.getMessage());
            }
        } else {
            try {
                Path targetPath = localBaseDir.resolve(key).normalize();
                if (targetPath.startsWith(localBaseDir)) {
                    Files.deleteIfExists(targetPath);
                }
            } catch (Exception e) {
                log.error("Failed to delete local file: {}", e.getMessage());
            }
        }
    }
}
