package com.practice.loginwebapp.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.practice.loginwebapp.models.Login;

@Repository
public interface LoginRepo extends JpaRepository<Login, Integer>{
    Optional<Login> findByUsername(String username);
}
