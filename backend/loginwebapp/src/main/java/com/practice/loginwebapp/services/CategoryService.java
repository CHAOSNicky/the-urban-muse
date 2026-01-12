package com.practice.loginwebapp.services;

import com.practice.loginwebapp.dtos.CategoryRequest;
import com.practice.loginwebapp.dtos.CategoryResponseDto;
import com.practice.loginwebapp.exceptions.DuplicationResourceEcxception;
import com.practice.loginwebapp.models.ProductCategory;
import com.practice.loginwebapp.repositories.CategoryRepo;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    private CategoryRepo categoryrepo;
    public CategoryService(CategoryRepo categoryrepo) {
        this.categoryrepo = categoryrepo;
    }

    public void addCategory(CategoryRequest categoryrequest){
        if(categoryrepo.existsByCategoryName(categoryrequest.getCategoryName())){
            throw new DuplicationResourceEcxception("Category Already Exist");
        }

        ProductCategory category = new ProductCategory();
        category.setCategoryName(categoryrequest.getCategoryName());
        category.setCategoryImageObjectKey(categoryrequest.getCategoryImageObjectKey());

        categoryrepo.save(category);
    }

    public List<CategoryResponseDto> getAllCategories(){
        List<ProductCategory> category = categoryrepo.findAll();

        return category
                .stream()
                .map(pc -> new CategoryResponseDto(
                        pc.getCategoryId(),
                        pc.getCategoryName(),
                        pc.getCategoryImageObjectKey()
                ))
                .toList();

    }
}
