package com.practice.loginwebapp.services;

import com.practice.loginwebapp.dtos.AddressDto;
import com.practice.loginwebapp.dtos.Signin;
import com.practice.loginwebapp.dtos.Signup;
import com.practice.loginwebapp.exceptions.AccountAlreadyPresentException;
import com.practice.loginwebapp.exceptions.InvalidOtpException;
import com.practice.loginwebapp.exceptions.ResourceNotFoundException;
import com.practice.loginwebapp.models.Account;
import com.practice.loginwebapp.models.Address;
import com.practice.loginwebapp.models.Role;
import com.practice.loginwebapp.util.JwtUtil;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.practice.loginwebapp.repositories.AccountRepo;
import java.util.Optional;

@Service
public class AccountService {

    private final AccountRepo accountrepo;
    private final PasswordEncoder encoder;
    private final StringRedisTemplate redistemplate;
    private final JwtUtil jwtutil;

    public AccountService(AccountRepo accountrepo, PasswordEncoder encoder, StringRedisTemplate redistemplate, JwtUtil jwtutil) {
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

    public void addAddress(Authentication authentication, AddressDto address){
        Account acc = accountrepo
                .findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Account does not exist"));
        if (acc.getAddress() == null) {
            acc.setAddress(new Address());
        }
        acc.getAddress().setStreet(address.getStreet());
        acc.getAddress().setCity(address.getCity());
        acc.getAddress().setState(address.getState());
        acc.getAddress().setZip(address.getZip());

        accountrepo.save(acc);
    }


    public AddressDto getAddress(Authentication authentication){
        Account acc = accountrepo
                .findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Account does not exist"));
        if (acc.getAddress() == null) {
            return new AddressDto("", "", "", "");
        }
        AddressDto addressDto = new AddressDto();
        addressDto.setStreet(acc.getAddress().getStreet());
        addressDto.setCity(acc.getAddress().getCity());
        addressDto.setState(acc.getAddress().getState());
        addressDto.setZip(acc.getAddress().getZip());

        return addressDto;
    }
}
