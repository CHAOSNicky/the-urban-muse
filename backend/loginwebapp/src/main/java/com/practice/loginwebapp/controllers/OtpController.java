package com.practice.loginwebapp.controllers;

import com.practice.loginwebapp.dtos.Otp;
import com.practice.loginwebapp.models.Login;
import com.practice.loginwebapp.repositories.LoginRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.practice.loginwebapp.services.OtpService;

import java.util.Optional;

@RestController
//@CrossOrigin(origins = "http://127.0.0.1:63342")
@RequestMapping("/api/otp")
public class OtpController {

    @Autowired
    OtpService otpservice;

    @Autowired
    LoginRepo loginrepo;
 
    @PostMapping("/generate")
    public ResponseEntity<String> generateOtp(@RequestBody Otp otp){
        System.out.println("Generating OTP for "+ otp.getFullName());

        if(otp.getFullName() == null){
            Optional<Login> name = loginrepo.findByUsername(otp.getEmail());
            otp.setFullName(name.get().getFullName());
        }

        String subject = "THE URBAN MUSE | Authentication";
        String body = "Hello "+ otp.getFullName() + "\n" +"Welcome to THE URBAN MUSE\n" + "Your Authentication Code is : ";
        return ResponseEntity.ok(otpservice.sendMail(otp.getEmail(), subject, body));
    }
    
}
