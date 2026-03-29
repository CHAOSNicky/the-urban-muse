package com.practice.loginwebapp.repositories;

import com.practice.loginwebapp.models.Account;
import com.practice.loginwebapp.models.Cart;
import com.practice.loginwebapp.models.CartStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartRepo extends JpaRepository<Cart, Long> {
    Optional<Cart> findByAccountAndCartStatus(Account account, CartStatus cartStatus);
}
