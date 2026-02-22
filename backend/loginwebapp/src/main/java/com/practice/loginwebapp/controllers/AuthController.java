package com.practice.loginwebapp.controllers;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import com.practice.loginwebapp.dtos.Signin;
import com.practice.loginwebapp.dtos.Signup;
import com.practice.loginwebapp.dtos.SuccessResposne;
import com.practice.loginwebapp.models.Account;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.practice.loginwebapp.repositories.LoginRepo;
import com.practice.loginwebapp.services.AuthService;
import com.practice.loginwebapp.util.JwtUtil;

import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final LoginRepo loginrepo;
    private final JwtUtil jwtUtil;
    private final AuthService authservice;
    private final StringRedisTemplate redistemplate;


    public AuthController(LoginRepo loginrepo, JwtUtil jwtUtil, AuthService authservice, StringRedisTemplate redistemplate) {
        this.loginrepo = loginrepo;
        this.jwtUtil = jwtUtil;
        this.authservice = authservice;
        this.redistemplate = redistemplate;
    }


    @PostMapping("/signup")
    public ResponseEntity<SuccessResposne> storeLoginCred(@RequestBody Signup signup){
              authservice.createAccount(signup);
              return ResponseEntity.status(HttpStatus.CREATED).body(new SuccessResposne("Account Created"));
    } 


    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody Signin signin) {

        String token = authservice.verifyAccount(signin);
        ResponseCookie cookie =
                ResponseCookie.from("jwt", token)
                        .httpOnly(true)
                        .secure(false)
                        .path("/")
                        .maxAge(60 * 60)
                        .sameSite("Lax")
                .build();
        return ResponseEntity.status(HttpStatus.OK)
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(
                        Map.of(
                                "message", "User Successfully Authenticated",
                                "fullname", loginrepo.findByEmail(signin.getEmail()).get().getFullName()
                        )
                );
    }


    @GetMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(){

        System.out.println("Entered to logout");
        ResponseCookie cookie =
                ResponseCookie.from("jwt", "")
                        .httpOnly(true)
                        .secure(false)
                        .path("/")
                        .maxAge(0)
                        .sameSite("Lax")
                .build();

        return ResponseEntity.status(HttpStatus.OK)
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(
                        Map.of(
                                "message", "Cookies are cleared and LoggedOut Successfully"
                        )
                );
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication authentication){
        if(authentication == null || !authentication.isAuthenticated()){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String email = authentication.getName();
        Account acc =  loginrepo.findByEmail(email).orElseThrow();

        return ResponseEntity.status(HttpStatus.OK).body(
                Map.of(
                        "fullname", acc.getFullName(),
                        "email", email,
                        "role", acc.getRole().name()
                )
        );

    }

}
