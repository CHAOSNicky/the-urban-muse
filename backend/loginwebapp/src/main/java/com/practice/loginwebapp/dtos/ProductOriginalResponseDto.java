package com.practice.loginwebapp.dtos;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ProductOriginalResponseDto {
    private Long productId;
    private String categoryName;
    private String name;
    private String description;
    private List<String> productImageObjectKey;
    private List<ProductVarientResponseDto> varientResponseList;
}
