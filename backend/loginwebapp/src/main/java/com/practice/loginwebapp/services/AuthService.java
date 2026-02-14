package com.practice.loginwebapp.services;

import com.practice.loginwebapp.dtos.Signup;
import com.practice.loginwebapp.exceptions.AccountAlreadyPresentException;
import com.practice.loginwebapp.exceptions.InvalidOtpException;
import com.practice.loginwebapp.models.Account;
import com.practice.loginwebapp.models.Role;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.practice.loginwebapp.repositories.LoginRepo;

import java.util.Optional;

@Service
public class AuthService {

    private final LoginRepo loginrepo;
    private final PasswordEncoder encoder;
    private final StringRedisTemplate redistemplate;

    public AuthService(LoginRepo loginrepo, PasswordEncoder encoder, StringRedisTemplate redistemplate) {
        this.loginrepo = loginrepo;
        this.encoder = encoder;
        this.redistemplate = redistemplate;
    }

    public void createAccount(Signup signup){
        String storedOtp = redistemplate.opsForValue().get("OTP_" + signup.getEmail());
        Optional<Account> acc = loginrepo.findByEmail(signup.getEmail());
        if(acc.isPresent()){
            throw new AccountAlreadyPresentException("Account already exists");
        }
        else if(signup.authCode == null || !signup.authCode.equals(storedOtp)) {
            throw new InvalidOtpException("Invalid OTP");
        }

        Account account = new Account();
        account.setFullName(signup.getFullName());
        account.setEmail(signup.getEmail());
        account.setRole(Role.USER);

        loginrepo.save(account);
    }
}
