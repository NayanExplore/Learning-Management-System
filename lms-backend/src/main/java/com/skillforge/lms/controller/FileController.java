package com.skillforge.lms.controller;

import com.skillforge.lms.service.FileStorageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/files")
@Tag(name = "Files", description = "File storage, preview, and download service")
public class FileController {

    private final FileStorageService fileStorageService;

    public FileController(FileStorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
    }

    @GetMapping("/download")
    @Operation(summary = "Download or stream an uploaded file or image")
    public ResponseEntity<byte[]> downloadFile(@RequestParam("key") String key) {
        byte[] bytes = fileStorageService.getFileBytes(key);
        if (bytes == null || bytes.length == 0) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        MediaType mediaType = determineMediaType(key);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(mediaType);
        
        // If image, display inline; if other, display inline or attachment
        String filename = extractFilename(key);
        if (mediaType.getType().equals("image")) {
            headers.add(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"");
        } else {
            headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"");
        }
        headers.setContentLength(bytes.length);

        return new ResponseEntity<>(bytes, headers, HttpStatus.OK);
    }

    private MediaType determineMediaType(String key) {
        String lower = key.toLowerCase();
        if (lower.endsWith(".png")) return MediaType.IMAGE_PNG;
        if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return MediaType.IMAGE_JPEG;
        if (lower.endsWith(".gif")) return MediaType.IMAGE_GIF;
        if (lower.endsWith(".webp")) return MediaType.parseMediaType("image/webp");
        if (lower.endsWith(".svg")) return MediaType.parseMediaType("image/svg+xml");
        if (lower.endsWith(".pdf")) return MediaType.APPLICATION_PDF;
        if (lower.endsWith(".json")) return MediaType.APPLICATION_JSON;
        return MediaType.APPLICATION_OCTET_STREAM;
    }

    private String extractFilename(String key) {
        int idx = key.lastIndexOf('/');
        if (idx >= 0 && idx < key.length() - 1) {
            return key.substring(idx + 1);
        }
        return key;
    }
}
