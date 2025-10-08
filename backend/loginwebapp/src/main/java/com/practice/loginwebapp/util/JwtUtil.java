package com.practice.loginwebapp.util;

import java.sql.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
// import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;

// import com.practice.loginwebapp.services.UserDetailService;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {
    @Value("${app.jwt.secret}")
    private String secret;
    @Value("${app.jwt.expiration}")
    private long expiration;

    public String generateToken(String username) {
    
       return Jwts.builder()
               .setSubject(username)
               .setIssuedAt(new Date(System.currentTimeMillis()))
               .setExpiration(new Date(System.currentTimeMillis() + expiration))
               .signWith(Keys.hmacShaKeyFor(secret.getBytes()), SignatureAlgorithm.HS256)
               .compact();
    }


    
    public String extractUsername(String token) {

       return Jwts.parserBuilder()
               .setSigningKey(Keys.hmacShaKeyFor(secret.getBytes()))
               .build()
               .parseClaimsJws(token)
               .getBody()
               .getSubject();
    }



    @SuppressWarnings("UseSpecificCatch")
    public boolean validateToken(String token, UserDetails userDetails) {
        try {
            Jwts.parserBuilder()
                .setSigningKey(Keys.hmacShaKeyFor(secret.getBytes()))
                .build()
                .parseClaimsJws(token); // ✅ This will throw an exception if invalid

            return true; // Token is valid
            } catch (Exception e) {
                // You can log the error or handle specific exceptions
                System.out.println("Invalid token: " + e.getMessage());
                return false;
            }
    }
}