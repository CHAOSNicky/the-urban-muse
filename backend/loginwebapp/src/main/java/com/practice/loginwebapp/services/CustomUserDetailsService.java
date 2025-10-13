package com.practice.loginwebapp.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.practice.loginwebapp.models.Login;
import com.practice.loginwebapp.repositories.LoginRepo;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private LoginRepo userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Login user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        return org.springframework.security.core.userdetails.User
                .withUsername(user.getUsername())// Ensure password is encoded with BCrypt
                .authorities("USER") // Add roles or authorities if needed
                .build();
    }
}
