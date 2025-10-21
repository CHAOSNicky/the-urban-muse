package com.practice.loginwebapp.controllers;

import java.util.HashMap;
import java.util.Map;

import com.practice.loginwebapp.dtos.Signin;
import com.practice.loginwebapp.dtos.Signup;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.practice.loginwebapp.models.Login;
import com.practice.loginwebapp.repositories.LoginRepo;
import com.practice.loginwebapp.services.LoginService;
import com.practice.loginwebapp.util.JwtUtil;

import jakarta.servlet.http.HttpServletResponse;



// import lombok.Data;

@RestController
@RequestMapping("/api") 
//@CrossOrigin(origins = "http://127.0.0.1:63342")
public class LoginController {

    private final LoginRepo repo;
    private final JwtUtil jwtUtil;

    public LoginController(LoginRepo repo, JwtUtil jwtUtil) {
        this.repo = repo;
        this.jwtUtil = jwtUtil;
    }


    @Autowired
    LoginService loginservice;

    @Autowired
    StringRedisTemplate redistemplate;

    @PostMapping("/signup")
    public ResponseEntity<String> storeLoginCred(@RequestBody Signup signup){
            // System.out.println("Got data------------------------------------------------------------------------------------------------------------------------------------------");
            // System.out.println(logincred);
            String username = signup.getEmail();
            String otp = signup.getAuthCode();

            Login logincred = new Login();

            logincred.setUsername(username);
            logincred.setFullName(signup.getFullName());

            String storedotp = redistemplate.opsForValue().get("OTP_" + username);

            if(storedotp == null || !storedotp.equals(otp)){
                   return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid OTP");
            }
            
            boolean result = loginservice.storecred(logincred);
            if(result){
                return ResponseEntity.status(HttpStatus.CREATED).body("Successfully Saved");
            }
            else{
                return ResponseEntity.status(HttpStatus.GONE).body("Not Saved Successfully");
            }
            
            // return ResponseEntity.ok("Login Successful");
    } 



    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody Signin signin, HttpServletResponse response) {

        Map<String, String> result = new HashMap<>();
        System.out.println("vandhuten------------------------------------------------------------------------------------------------------------------------------------");

        String username = signin.getEmail();
        String otp = signin.getAuthCode();

        Login user = repo.findByUsername(username)
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
        // System.out.println("here it came");

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
    public ResponseEntity<String> logout(HttpServletResponse response){

            ResponseCookie cookie = ResponseCookie
            .from("token", "")
            .httpOnly(false)
            .secure(true)
            .path("/")
            .maxAge(0)
            .sameSite("None")
            .build();

            response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

            return ResponseEntity.status(HttpStatus.OK).body("Cookies are cleared and LoggedOut Successfully");
    }

}
