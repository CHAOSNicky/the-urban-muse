package com.practice.loginwebapp.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class ProductOriginalResponseDto {
    private Long productId;
    private String categoryName;
    private String name;
    private String description;
    private List<String> productImageObjectKey;
}
