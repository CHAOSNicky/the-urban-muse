package com.practice.loginwebapp.repositories;

import com.practice.loginwebapp.models.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartRepo extends JpaRepository<Cart, Long> {

}
