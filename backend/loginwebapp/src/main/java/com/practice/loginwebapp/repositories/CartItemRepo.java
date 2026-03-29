package com.practice.loginwebapp.repositories;

import com.practice.loginwebapp.models.Cart;
import com.practice.loginwebapp.models.CartItem;
import com.practice.loginwebapp.models.ProductVarient;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartItemRepo extends JpaRepository<CartItem, Long> {
    Optional<CartItem> findByCartAndProductVarient(Cart cart, ProductVarient productVarient);
}
