package com.practice.loginwebapp.repositories;

import com.practice.loginwebapp.models.ProductVarient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductVarientRepo extends JpaRepository<ProductVarient, Long> {
}
