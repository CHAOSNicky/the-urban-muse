package com.practice.loginwebapp.controllers;

import java.util.Map;
import com.practice.loginwebapp.dtos.AddressDto;
import com.practice.loginwebapp.dtos.Signin;
import com.practice.loginwebapp.dtos.Signup;
import com.practice.loginwebapp.dtos.SuccessResposne;
import com.practice.loginwebapp.exceptions.AuthenticationIsNullException;
import com.practice.loginwebapp.models.Account;
import com.practice.loginwebapp.repositories.AccountRepo;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.practice.loginwebapp.services.AccountService;
import com.practice.loginwebapp.util.JwtUtil;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AccountRepo accountrepo;
    private final JwtUtil jwtUtil;
    private final AccountService accountservice;
    private final StringRedisTemplate redistemplate;


    public AuthController(AccountRepo accountrepo, JwtUtil jwtUtil, AccountService accountservice, StringRedisTemplate redistemplate) {
        this.accountrepo = accountrepo;
        this.jwtUtil = jwtUtil;
        this.accountservice = accountservice;
        this.redistemplate = redistemplate;
    }


    @PostMapping("/signup")
    public ResponseEntity<SuccessResposne> storeLoginCred(@RequestBody Signup signup){
              accountservice.createAccount(signup);
              return ResponseEntity.status(HttpStatus.CREATED).body(new SuccessResposne("Account Created"));
    } 


    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody Signin signin) {

        String token = accountservice.verifyAccount(signin);
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
                                "fullname", accountrepo.findByEmail(signin.getEmail()).get().getFullName()
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


    @PutMapping("/account/address")
    public ResponseEntity<?> postAddress(@RequestBody AddressDto address, Authentication authentication){
        accountservice.addAddress(authentication, address);
        return ResponseEntity.status(HttpStatus.CREATED).body("Successfully post address");
    }


    @GetMapping("/account/address")
    public ResponseEntity<AddressDto> getAddress(Authentication authentication){
        return ResponseEntity.status(HttpStatus.CREATED).body(accountservice.getAddress(authentication));
    }


    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication authentication){
        if(authentication == null || !authentication.isAuthenticated()){
            throw new AuthenticationIsNullException("Authentication is needed");
        }

        String email = authentication.getName();
        Account acc =  accountrepo.findByEmail(email).orElseThrow();

        return ResponseEntity.status(HttpStatus.OK).body(
                Map.of(
                        "fullname", acc.getFullName(),
                        "email", email,
                        "role", acc.getRole().name()
                )
        );

    }

}
