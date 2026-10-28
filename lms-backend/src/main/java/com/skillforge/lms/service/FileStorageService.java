package com.skillforge.lms.service;

import java.io.InputStream;

public interface FileStorageService {
    String uploadFile(String key, InputStream inputStream, long contentLength, String contentType);
    String getPresignedUrl(String key);
    byte[] getFileBytes(String key);
    void deleteFile(String key);
}
