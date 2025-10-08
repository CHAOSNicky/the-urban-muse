package com.practice.loginwebapp.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
// import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CartProduct {
        
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private int id;
        
        @ManyToOne
        @JoinColumn( name = "user_id", nullable = false )
        private Login user;

        @ManyToOne
        @JoinColumn( name = "product_id", nullable = false )
        private AddProduct product;

}
