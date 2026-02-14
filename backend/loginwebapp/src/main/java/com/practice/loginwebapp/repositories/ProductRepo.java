package com.practice.loginwebapp.repositories;

import com.practice.loginwebapp.dtos.ProductResponseDto;
import com.practice.loginwebapp.models.Product;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

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


    @Query("""
            SELECT p FROM Product p
            LEFT JOIN FETCH p.varients
            WHERE p.productId = :id
            """)
    Optional<Product> findProductWithVarient(@Param("id") Long id);


//    List<Product> findByProductCategory_categoryName(String categoryName);
}
