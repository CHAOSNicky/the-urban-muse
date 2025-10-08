package com.practice.loginwebapp.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.practice.loginwebapp.models.Login;
import com.practice.loginwebapp.repositories.LoginRepo;

@Service
public class LoginService{

    public LoginService(){
            System.out.println("Entered the Service Class");
    }

    @Autowired
    private LoginRepo loginrepo;

    @Autowired
    private PasswordEncoder encoder;
    
    public boolean storecred(Login logincred){
        
        logincred.setPassword(encoder.encode(logincred.getPassword()));
        Login saved = loginrepo.save(logincred);
        
        return saved != null;
    }
}
