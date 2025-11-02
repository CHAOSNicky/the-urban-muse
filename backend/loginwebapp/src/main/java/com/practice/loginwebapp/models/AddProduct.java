package com.practice.loginwebapp.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AddProduct {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long product_id;

    private String productName;
    private String productDesc;
    private String productCategory;
    private String productSize;
    private float productPrice;
    private int productQuantity;
    private String imageObjectKey;
}
