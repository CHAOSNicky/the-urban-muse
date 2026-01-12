package com.practice.loginwebapp.dtos;

import com.practice.loginwebapp.models.Product;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductVarientRequest {
    private String size;
    private Long quantity;
    private BigDecimal price;
    private Boolean newArrival;
}
