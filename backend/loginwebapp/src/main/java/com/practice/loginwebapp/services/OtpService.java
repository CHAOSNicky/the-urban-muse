package com.practice.loginwebapp.services;

import java.util.Random;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

@Service
public class OtpService {

    @Autowired
    StringRedisTemplate redistemplate;


    public String genrateOtp(String username){

        String otp = String.format("%06d", new Random().nextInt(999999));

        redistemplate.opsForValue().set("OTP_" + username, otp, 30, TimeUnit.SECONDS);

        return otp;
    }
}
