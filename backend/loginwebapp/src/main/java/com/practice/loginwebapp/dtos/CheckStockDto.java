package com.practice.loginwebapp.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CheckStockDto {
    private Long variantId;
    private String size;
    private Long quantity;
}
