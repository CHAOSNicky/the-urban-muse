package com.practice.loginwebapp.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CartItemResponseDto {
        private Long productId;
        private Long variantId;
        private String name;
        private String size;
        private BigDecimal price;
        private Long quantity;
        private String image;
}
