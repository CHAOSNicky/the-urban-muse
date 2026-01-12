package com.practice.loginwebapp.repositories;

import com.practice.loginwebapp.dtos.ProductResponseDto;
import com.practice.loginwebapp.models.Product;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepo extends JpaRepository<Product,Long> {
    @Query("""
            select new com.practice.loginwebapp.dtos.ProductResponseDto(
                p.productId,
                c.categoryName,
                p.name,
                p.description,
                p.productImageObjectKey
                ) from Product p
                join p.productCategory c
                where lower(c.categoryName) = lower(:categoryName)
            """)
    List<ProductResponseDto> findProductsByCategoryName(@Param("categoryName") String categoryName);

//    List<Product> findByProductCategory_categoryName(String categoryName);
}
