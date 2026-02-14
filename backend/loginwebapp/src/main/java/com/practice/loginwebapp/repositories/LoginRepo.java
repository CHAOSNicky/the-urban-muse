package com.practice.loginwebapp.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.practice.loginwebapp.models.Account;

@Repository
public interface LoginRepo extends JpaRepository<Account, Integer>{
    Optional<Account> findByEmail(String email);
}
