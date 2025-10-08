package com.practice.loginwebapp.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.practice.loginwebapp.services.OtpService;

@RestController
//@CrossOrigin(origins = "http://127.0.0.1:63342")
@RequestMapping("/api/otp")
public class OtpController {

    @Autowired
    OtpService otpservice;
 
    @GetMapping("/generate")
    public ResponseEntity<String> generateOtp(@RequestParam String username){
        return ResponseEntity.ok(otpservice.genrateOtp(username));
    }
    
}
