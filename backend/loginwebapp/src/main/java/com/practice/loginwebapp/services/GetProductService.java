package com.practice.loginwebapp.services;

import com.practice.loginwebapp.dtos.ProductOriginalResponseDto;
import com.practice.loginwebapp.dtos.ProductResponseDto;
import com.practice.loginwebapp.dtos.ProductVarientResponseDto;
import com.practice.loginwebapp.exceptions.ResourceNotFoundException;
import com.practice.loginwebapp.models.Product;
import com.practice.loginwebapp.repositories.ProductRepo;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
public class GetProductService {

    private ProductRepo productrepo;
    public GetProductService(ProductRepo productrepo) {
        this.productrepo=productrepo;
    }

    public List<ProductOriginalResponseDto> getProductByCategory(String categoryName){
        return productrepo.
                findProductsByCategoryName(categoryName)
                .stream()
                .map(raw -> new ProductOriginalResponseDto(
                        raw.getProductId(),
                        raw.getCategoryName(),
                        raw.getName(),
                        raw.getDescription(),
                        splitImage(raw.getProductImageObjectKey()),
                        null
                ))
                .toList();
    }

    public ProductOriginalResponseDto getSingleProduct(Long productId){
        Product product = productrepo.findProductWithVarient(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product Not Found"));

        List<ProductVarientResponseDto> productVarients = product.getVarients()
                .stream()
                .map(pv -> new ProductVarientResponseDto(pv.getVarientId(),
                                                                        pv.getSize(),
                                                                        pv.getPrice(),
                                                                        pv.getQuantity()))
                .toList();


        return new ProductOriginalResponseDto(
                    product.getProductId(),
                    null,
                    product.getName(),
                    product.getDescription(),
                    splitImage(product.getProductImageObjectKey()),
                    productVarients
                    );

    }

    public List<String> splitImage(String imageKey){
        if(imageKey == null || imageKey.isEmpty()){
            return List.of();
        }

        return Arrays.stream(imageKey.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .toList();
    }
}
