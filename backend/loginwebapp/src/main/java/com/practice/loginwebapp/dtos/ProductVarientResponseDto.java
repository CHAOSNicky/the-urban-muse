package com.practice.loginwebapp.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class ProductVarientResponseDto {
    private Long varientId;
    private String size;
    private BigDecimal price;
    private Long quantity;
}
