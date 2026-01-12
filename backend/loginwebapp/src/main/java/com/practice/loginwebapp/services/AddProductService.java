package com.practice.loginwebapp.services;

import com.practice.loginwebapp.dtos.AddProductDto;
import com.practice.loginwebapp.dtos.ProductRequest;
import com.practice.loginwebapp.dtos.ProductVarientRequest;
import com.practice.loginwebapp.exceptions.ResourceNotFoundException;
import com.practice.loginwebapp.models.AddProduct;
import com.practice.loginwebapp.models.Product;
import com.practice.loginwebapp.models.ProductCategory;
import com.practice.loginwebapp.models.ProductVarient;
import com.practice.loginwebapp.repositories.AddProductRepo;
import com.practice.loginwebapp.repositories.CategoryRepo;
import com.practice.loginwebapp.repositories.ProductRepo;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AddProductService {

    private CategoryRepo categoryrepo;
    private ProductRepo productrepo;
    public AddProductService(CategoryRepo categoryrepo, ProductRepo productrepo) {
        this.productrepo = productrepo;
        this.categoryrepo = categoryrepo;
    }

    @Transactional
    public void addProduct(ProductRequest productrequest){
        System.out.println("Service Reached");
        ProductCategory category = categoryrepo.findById(productrequest.getCategoryId())
                                                .orElseThrow(()-> new ResourceNotFoundException("Invalid Category"));


        Product product = new Product();
        product.setProductCategory(category);
        product.setName(productrequest.getName());
        product.setDescription(productrequest.getDescription());
        String image_keys = String.join(",", productrequest.getProductImageObjectKey());
        product.setProductImageObjectKey(image_keys);

        for(ProductVarientRequest v : productrequest.getVarients()){
            ProductVarient pv = new ProductVarient();
            pv.setSize(v.getSize());
            pv.setQuantity(v.getQuantity());
            pv.setPrice(v.getPrice());
            pv.setNewArrival(v.getNewArrival());
            pv.setProduct(product);

            product.getVarients().add(pv);
        }

        productrepo.save(product);
    }
}



//        AddProduct addproduct1 = new AddProduct();
//        addproduct1.setProductName(addproduct.getProductName());
//        addproduct1.setProductDesc(addproduct.getProductDesc());
//        addproduct1.setProductCategory(addproduct.getProductCategory());
//        addproduct1.setProductPrice(addproduct.getProductPrice());
//        addproduct1.setProductSize(addproduct.getProductSize());
//        addproduct1.setProductQuantity(addproduct.getProductQuantity());
//        List<String> images = addproduct.getImageKey();
//        String imageKey = String.join(",",images);
//        addproduct1.setImageObjectKey(imageKey);
//        AddProduct saved = addproductrepo.save(addproduct1);
//        return saved.getProduct_id();