package com.practice.loginwebapp.services;

import com.practice.loginwebapp.dtos.AddProductDto;
import com.practice.loginwebapp.models.AddProduct;
import com.practice.loginwebapp.repositories.AddProductRepo;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AddProductService {

    private AddProductRepo addproductrepo;
    public AddProductService(AddProductRepo addproductrepo) {
        this.addproductrepo = addproductrepo;
    }

    public long addProduct(AddProductDto addproduct){

        AddProduct addproduct1 = new AddProduct();
        addproduct1.setProductName(addproduct.getProductName());
        addproduct1.setProductDesc(addproduct.getProductDesc());
        addproduct1.setProductCategory(addproduct.getProductCategory());
        addproduct1.setProductPrice(addproduct.getProductPrice());
        addproduct1.setProductSize(addproduct.getProductSize());
        addproduct1.setProductQuantity(addproduct.getProductQuantity());
        List<String> images = addproduct.getImageKey();
        String imageKey = String.join(",",images);
        addproduct1.setImageObjectKey(imageKey);
        AddProduct saved = addproductrepo.save(addproduct1);
        return saved.getProduct_id();
    }
}
