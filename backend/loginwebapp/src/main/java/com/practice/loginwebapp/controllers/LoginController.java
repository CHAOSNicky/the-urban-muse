package com.practice.loginwebapp.controllers;

import java.util.HashMap;
import java.util.Map;

import com.practice.loginwebapp.dtos.Signin;
import com.practice.loginwebapp.dtos.Signup;
import com.practice.loginwebapp.dtos.SuccessResposne;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.practice.loginwebapp.models.Account;
import com.practice.loginwebapp.repositories.LoginRepo;
import com.practice.loginwebapp.services.AuthService;
import com.practice.loginwebapp.util.JwtUtil;

import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api")
public class LoginController {

    private final LoginRepo repo;
    private final JwtUtil jwtUtil;
    private final AuthService loginservice;
    private final StringRedisTemplate redistemplate;


    public LoginController(LoginRepo repo, JwtUtil jwtUtil, AuthService loginservice, StringRedisTemplate redistemplate) {
        this.repo = repo;
        this.jwtUtil = jwtUtil;
        this.loginservice = loginservice;
        this.redistemplate = redistemplate;
    }


    @PostMapping("/signup")
    public ResponseEntity<SuccessResposne> storeLoginCred(@RequestBody Signup signup){
              loginservice.createAccount(signup);
              return ResponseEntity.status(HttpStatus.CREATED).body(new SuccessResposne("Account Created"));
    } 


    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody Signin signin, HttpServletResponse response) {

        Map<String, String> result = new HashMap<>();
        System.out.println("vandhuten------------------------------------------------------------------------------------------------------------------------------------");

        String username = signin.getEmail();
        String otp = signin.getAuthCode();

        Account user = repo.findByEmail(username)
                .orElse(null);

        // System.out.println(user.getUsername());
        if(user == null){
            System.out.println("User is Null");
        }
        else if(!otp.equals(redistemplate.opsForValue().get("OTP_" + username))){
            System.out.println("Invalid OTP");
        }

        if (user == null || !otp.equals(redistemplate.opsForValue().get("OTP_" + username))) {

            System.out.println("Username or OTP does not match");
            result.put("message", "Invalid Credentials");

            return ResponseEntity.status(401).body(result);
        }

        String fullname = user.getFullName();

        String token = jwtUtil.generateToken(username);

        ResponseCookie cookie = ResponseCookie
        .from("token", token)
        .httpOnly(false)       // Prevent access from JavaScript
        .secure(false)        // Set to true if using HTTPS
        .path("/")
        .maxAge(3600)         // 1 hour
        .sameSite("None")      // Adjust based on your frontend/backend setup
        .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        System.out.println("Cookies are set");

        result.put("message", "Login Successful");
        result.put("fullname", fullname);
        System.out.println(result);
        return ResponseEntity.ok(result);

    }


    @GetMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(HttpServletResponse response){

            Map <String, String> result = new HashMap<>();
            System.out.println("Entered to logout");
            ResponseCookie cookie = ResponseCookie
            .from("token", "")
            .httpOnly(false)
            .secure(false)
            .path("/")
            .maxAge(0)
            .sameSite("None")
            .build();

            response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
            result.put("message", "Cookies are cleared and LoggedOut Successfully");
            return ResponseEntity.status(HttpStatus.OK).body(result);
    }

}
