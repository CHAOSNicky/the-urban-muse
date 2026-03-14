package com.practice.loginwebapp.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AvailableQuantityResponseDto {
    private Long variantId;
    private String size;
    private Long availableStock;
}
