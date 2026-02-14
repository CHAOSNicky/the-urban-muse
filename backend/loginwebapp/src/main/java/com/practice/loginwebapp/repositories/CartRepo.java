package com.practice.loginwebapp.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.practice.loginwebapp.models.AddProduct;
import com.practice.loginwebapp.models.CartProduct;
import com.practice.loginwebapp.models.Account;

@Repository
public interface CartRepo extends JpaRepository<CartProduct, Integer>{
   
    List<CartProduct> findByUser(Account user);
    
    Optional<CartProduct> findByUserAndProduct(Account user, AddProduct product);
}