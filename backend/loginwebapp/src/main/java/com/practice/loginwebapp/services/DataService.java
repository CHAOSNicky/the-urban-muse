package com.practice.loginwebapp.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.practice.loginwebapp.models.AddProduct;
import com.practice.loginwebapp.repositories.AddProductRepo;
// import com.practice.loginwebapp.repositories.LoginRepo;

@Service
public class DataService {

    @Autowired
    AddProductRepo addproductrepo;

    public boolean addProducts(AddProduct addProduct){

        AddProduct saved;

        Optional<AddProduct> existingProduct = addproductrepo.findByProductNameAndProductSize(addProduct.getProductName(), addProduct.getProductSize());

        if(existingProduct.isPresent()){
            AddProduct updateProduct = existingProduct.get();
            updateProduct.setProductQuantity(updateProduct.getProductQuantity() + addProduct.getProductQuantity());
            saved = addproductrepo.save(updateProduct);
        }
        else{
            saved = addproductrepo.save(addProduct);
        }

        // AddProduct saved = addproductrepo.save(addProduct);

        return saved != null;
    }
    
}
