package com.practice.loginwebapp.controllers;

import com.practice.loginwebapp.dtos.AddProductDto;
import com.practice.loginwebapp.services.AddProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/product")
public class ProductsController {

    private AddProductService addproductservice;
    public ProductsController(AddProductService addproductservice){
        this.addproductservice = addproductservice;
    }

    @PostMapping("/add-product")
    public ResponseEntity<Map<String,Object>> productSave(@RequestBody AddProductDto addproduct){

        return ResponseEntity.ok(Map.of("Product_Id",addproductservice.addProduct(addproduct)));
    }
}
