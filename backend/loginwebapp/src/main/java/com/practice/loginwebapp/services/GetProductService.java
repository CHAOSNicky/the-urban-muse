package com.practice.loginwebapp.services;

import com.practice.loginwebapp.dtos.ProductOriginalResponseDto;
import com.practice.loginwebapp.dtos.ProductResponseDto;
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
                        splitImage(raw.getProductImageObjectKey())
                ))
                .toList();
    }

    public ProductOriginalResponseDto getSingleProduct(Long productId){
        Product product = productrepo.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product Not Found"));

        return new ProductOriginalResponseDto(
                    product.getProductId(),
                    null,
                    product.getName(),
                    product.getDescription(),
                    splitImage(product.getProductImageObjectKey())
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
