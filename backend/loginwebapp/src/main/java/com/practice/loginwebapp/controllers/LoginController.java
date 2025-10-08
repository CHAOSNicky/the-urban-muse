package com.practice.loginwebapp.controllers;

import java.util.Map;

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
    private final PasswordEncoder encoder;
    private final JwtUtil jwtUtil;

    public LoginController(LoginRepo repo, PasswordEncoder encoder, JwtUtil jwtUtil) {
        this.repo = repo;
        this.encoder = encoder;
        this.jwtUtil = jwtUtil;
    }


    @Autowired
    LoginService loginservice;

    @Autowired
    StringRedisTemplate redistemplate;
    

    @PostMapping("/signup")
    public ResponseEntity<String> storeLoginCred(@RequestBody Login logincred,
                                                 @RequestParam String otp){
            // System.out.println("Got data------------------------------------------------------------------------------------------------------------------------------------------");
            // System.out.println(logincred);
            String username = logincred.getUsername();

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
    public ResponseEntity<?> login(@RequestBody Map<String, String> body, HttpServletResponse response) {

        System.out.println("vandhuten------------------------------------------------------------------------------------------------------------------------------------");

        String username = body.get("username");
        String password = body.get("password");

        Login user = repo.findByUsername(username)
                .orElse(null);

        // System.out.println(user.getUsername());

        if (user == null || !encoder.matches(password, user.getPassword())) {


            System.out.println("Password does not match");
            
            return ResponseEntity.status(401).body(Map.of("message", "Invalid credentials"));
        }

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

        return ResponseEntity.ok(Map.of("message", "Login successful"));

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
