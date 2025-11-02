package com.practice.loginwebapp.controllers;

import com.practice.loginwebapp.dtos.PreSignUploadResponse;
import com.practice.loginwebapp.dtos.S3PreSignDto;
import com.practice.loginwebapp.services.s3PreSignedUrlService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;

import java.net.URL;
import java.util.List;

@RestController
@RequestMapping("/api/s3")
public class S3Controller {

    private final s3PreSignedUrlService s3presignedurlservice;
    public S3Controller(s3PreSignedUrlService s3presignedurlservice){
        this.s3presignedurlservice = s3presignedurlservice;
    }

    @PostMapping("/pre-signed-put-url")
    public ResponseEntity<List<PreSignUploadResponse>> preSignedPutUrl(@RequestBody List<S3PreSignDto> files){

        System.out.println("Entered the S3 Controller");
        return ResponseEntity.ok(s3presignedurlservice.preSignedPutUrl(files));

    }

    @GetMapping("/pre-signed-get-url")
    public ResponseEntity<String> preSignedGetUrl(){
        return ResponseEntity.ok("");
    }

}
