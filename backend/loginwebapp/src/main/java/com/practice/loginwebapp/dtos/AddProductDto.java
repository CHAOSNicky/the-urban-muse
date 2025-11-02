package com.practice.loginwebapp.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AddProductDto {
    private String productName;
    private String productDesc;
    private String productCategory;
    private float productPrice;
    private String productSize;
    private int productQuantity;
    private List<String> imageKey;
}
