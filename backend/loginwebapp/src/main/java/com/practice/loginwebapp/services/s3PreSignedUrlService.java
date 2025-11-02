package com.practice.loginwebapp.services;

import com.practice.loginwebapp.dtos.PreSignUploadResponse;
import com.practice.loginwebapp.dtos.S3PreSignDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

import java.net.URL;
import java.time.Duration;
import java.util.List;
import java.util.UUID;

@Service
public class s3PreSignedUrlService {

    @Value("${aws.s3.bucket}") String bucket;
    Duration expiration = Duration.ofMinutes(5);

    private final S3Presigner s3presigner;
    public s3PreSignedUrlService(S3Presigner s3presigner){
        this.s3presigner = s3presigner;
    }

    public List<PreSignUploadResponse> preSignedPutUrl(List<S3PreSignDto> files){
        System.out.println("Entered preSignedPutUrlService");
        return files.stream()
                .map(file ->{
                    String ext = switch (file.getContentType()) {
                        case "image/png" -> ".png";
                        case "image/jpeg" -> ".jpg";
                        case "image/webp" -> ".webp";
                        default -> "";
                    };
                    String objectkey = "the-urban-muse/" + "uploads/"  + UUID.randomUUID().toString() + ext;

                    PutObjectRequest putobjectrequest = PutObjectRequest.builder()
                            .bucket(bucket)
                            .key(objectkey)
                            .contentType(file.getContentType())
                            .build();

                    PutObjectPresignRequest putobjectpresignrequest = PutObjectPresignRequest.builder()
                            .signatureDuration(expiration)
                            .putObjectRequest(putobjectrequest)
                            .build();

                    URL url = s3presigner.presignPutObject(putobjectpresignrequest).url();
                    return new PreSignUploadResponse(objectkey, url);
                })
                .toList();
    }

    public void preSignedGetUrl(){

    }
}
