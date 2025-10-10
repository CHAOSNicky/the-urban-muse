package com.practice.loginwebapp.services;

import java.util.Random;
import java.util.concurrent.TimeUnit;

import com.practice.loginwebapp.util.CleanEmail;
import jakarta.mail.internet.AddressException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class OtpService {

    @Autowired
    StringRedisTemplate redistemplate;

    @Autowired
    private JavaMailSender mailsender;

    @Autowired
    private CleanEmail cleanemail;

    public String sendMail(String username, String subject, String body) {

        try {
            SimpleMailMessage message = new SimpleMailMessage();

            String to = cleanemail.cleanEmailOrThrow(username);

            String otp = String.format("%06d", new Random().nextInt(999999));
            body += otp;

            redistemplate.opsForValue().set("OTP_" + to, otp, 30, TimeUnit.SECONDS);

            message.setFrom("rameshsrinikesh@gmail.com");
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);

            mailsender.send(message);

            return "Mail Sent Successfully";

        } catch (AddressException e) {
            System.out.println("Invalid email: " + e.getMessage());
            return "Failed to send mail: Invalid email";
        }
    }

}

