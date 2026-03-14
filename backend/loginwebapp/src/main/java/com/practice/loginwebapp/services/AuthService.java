package com.practice.loginwebapp.services;

import com.practice.loginwebapp.dtos.Signin;
import com.practice.loginwebapp.dtos.Signup;
import com.practice.loginwebapp.exceptions.AccountAlreadyPresentException;
import com.practice.loginwebapp.exceptions.InvalidOtpException;
import com.practice.loginwebapp.models.Account;
import com.practice.loginwebapp.models.Role;
import com.practice.loginwebapp.util.JwtUtil;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.practice.loginwebapp.repositories.AccountRepo;

import java.util.Optional;

@Service
public class AuthService {

    private final AccountRepo accountrepo;
    private final PasswordEncoder encoder;
    private final StringRedisTemplate redistemplate;
    private final JwtUtil jwtutil;

    public AuthService(AccountRepo accountrepo, PasswordEncoder encoder, StringRedisTemplate redistemplate, JwtUtil jwtutil) {
        this.accountrepo = accountrepo;
        this.encoder = encoder;
        this.redistemplate = redistemplate;
        this.jwtutil = jwtutil;
    }

    public void createAccount(Signup signup){
        String storedOtp = redistemplate.opsForValue().get("OTP_" + signup.getEmail());
        Optional<Account> acc = accountrepo.findByEmail(signup.getEmail());
        if(acc.isPresent()){
            throw new AccountAlreadyPresentException("Account already exists");
        }
        else if(signup.getAuthCode() == null || !signup.getAuthCode().equals(storedOtp)) {
            throw new InvalidOtpException("Invalid OTP");
        }

        Account account = new Account();
        account.setFullName(signup.getFullName());
        account.setEmail(signup.getEmail());
        account.setRole(Role.USER);

        accountrepo.save(account);
    }

    public String verifyAccount(Signin signin){
        String storedOtp = redistemplate.opsForValue().get("OTP_" + signin.getEmail());
        Optional<Account> acc = accountrepo.findByEmail(signin.getEmail());
        if(acc.isEmpty()){
            throw new AccountAlreadyPresentException("Account does not exist");
        }
        else if(signin.getAuthCode() == null || !signin.getAuthCode().equals(storedOtp)) {
            throw new InvalidOtpException("Invalid OTP");
        }

        return jwtutil.generateToken(acc.get());
    }
}
