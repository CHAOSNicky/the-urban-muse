package com.practice.loginwebapp.repositories;

import java.util.Optional;
// import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.practice.loginwebapp.models.AddProduct;

@Repository
public interface AddProductRepo extends JpaRepository<AddProduct, Integer> {

    // List<AddProduct> findAll(); // Optional, since JpaRepository already provides this
    Optional<AddProduct> findByProductNameAndProductSize(String productname, String productsize);
}
