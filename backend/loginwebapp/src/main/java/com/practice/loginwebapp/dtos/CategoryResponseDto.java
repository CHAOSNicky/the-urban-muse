package com.practice.loginwebapp.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CategoryResponseDto {
    private Long categoryId;
    private String categoryName;
    private String categoryImageObjectKey;
}
