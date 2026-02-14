package com.practice.loginwebapp.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.practice.loginwebapp.models.Account;
import com.practice.loginwebapp.repositories.LoginRepo;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private LoginRepo userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        System.out.println("Entered loadByUsername");
        Account user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        System.out.println("User Details are : " + user.getEmail());
        String password = ""; // intentionally empty, JWT-based auth

        return org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(password)                    // <-- required by builder
                .authorities("ROLE_USER")              // or "USER" depending how you check roles
                .accountExpired(false)
                .accountLocked(false)
                .credentialsExpired(false)
                .disabled(false)
                .build();
    }
}
