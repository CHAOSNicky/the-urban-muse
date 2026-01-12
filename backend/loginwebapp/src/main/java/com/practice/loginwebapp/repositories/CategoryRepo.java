package com.practice.loginwebapp.repositories;

import com.practice.loginwebapp.models.ProductCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepo extends JpaRepository<ProductCategory, Long> {
    boolean existsByCategoryName(String category_name);
}
