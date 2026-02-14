package com.practice.loginwebapp.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductRequest {
    private Long categoryId;
    private String name;
    private String description;
    private Boolean newArrival;
    private List<String> productImageObjectKey = new ArrayList<>();
    private List<ProductVarientRequest> varients = new ArrayList<>();
}
