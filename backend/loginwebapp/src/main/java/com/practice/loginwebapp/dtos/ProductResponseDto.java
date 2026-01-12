package com.practice.loginwebapp.dtos;

import com.practice.loginwebapp.models.ProductCategory;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class ProductResponseDto {
    private Long productId;
    private String categoryName;
    private String name;
    private String description;
    private String productImageObjectKey;
}
