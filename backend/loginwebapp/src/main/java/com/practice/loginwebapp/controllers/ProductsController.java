package com.practice.loginwebapp.controllers;

import com.practice.loginwebapp.dtos.*;
import com.practice.loginwebapp.models.Product;
import com.practice.loginwebapp.services.AddProductService;
import com.practice.loginwebapp.services.CategoryService;
import com.practice.loginwebapp.services.GetProductService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/product")
public class ProductsController {

    private AddProductService addproductservice;
    private CategoryService categoryservice;
    private GetProductService getproductservice;
    public ProductsController(AddProductService addproductservice, CategoryService categoryservice, GetProductService getproductservice) {
        this.addproductservice = addproductservice;
        this.categoryservice = categoryservice;
        this.getproductservice = getproductservice;
    }

    @PostMapping("/add-product")
    public ResponseEntity<?> productSave(@RequestBody ProductRequest productrequest){

        addproductservice.addProduct(productrequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(new SuccessResposne("Product added successfully"));
    }

    @PostMapping("/add-category")
    public ResponseEntity<?> categorySave(@RequestBody CategoryRequest categoryrequest){
        System.out.println("Request Reached the Controller");
        categoryservice.addCategory(categoryrequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(new SuccessResposne("Product added successfully"));
    }

    @GetMapping("/get-products-by-cat/{categoryName}")
    public ResponseEntity<List<ProductOriginalResponseDto>> getProductByCategory(@PathVariable String categoryName){
        return ResponseEntity.status(HttpStatus.OK).body(getproductservice.getProductByCategory(categoryName));
    }

    @GetMapping("/get-category")
    public ResponseEntity<List<CategoryResponseDto>> getAllCategory(){
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(categoryservice.getAllCategories());
    }
}
