package com.practice.loginwebapp.services;

import com.practice.loginwebapp.dtos.AddCart;
import com.practice.loginwebapp.dtos.AvailableQuantityResponseDto;
import com.practice.loginwebapp.dtos.CheckStockDto;
import com.practice.loginwebapp.exceptions.ResourceNotFoundException;
import com.practice.loginwebapp.models.*;
import com.practice.loginwebapp.repositories.AccountRepo;
import com.practice.loginwebapp.repositories.CartRepo;
import com.practice.loginwebapp.repositories.ProductVarientRepo;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import java.util.Map;


@Service
public class CartService {

    private final CartRepo cartRepo;
    private final AccountRepo accountRepo;
    private final ProductVarientRepo productVarientRepo;
    public CartService(CartRepo cartRepo, AccountRepo accountRepo, ProductVarientRepo productVarientRepo) {
        this.cartRepo = cartRepo;
        this.accountRepo = accountRepo;
        this.productVarientRepo = productVarientRepo;
    }

    public void addCart(AddCart addCart, Authentication authentication) {
        String email = authentication.getName();
        Account acc = accountRepo.findByEmail(email).orElseThrow(()-> new RuntimeException("User not found"));

        Cart cart = new Cart();
        cart.setAccount(acc);
        cart.setCartStatus(CartStatus.ACTIVE);

        for(Map.Entry<Long, Long> prodIdAndQuantity : addCart.getCartProdIdAndQuantity().entrySet()){
            ProductVarient productVarient = productVarientRepo.findByVarientId(prodIdAndQuantity.getKey()).orElseThrow(()-> new RuntimeException("Product not found"));
            CartItem cartItem = new CartItem();
            cartItem.setCart(cart);
            cartItem.setProductVarient(productVarient);
            cartItem.setQuantity(prodIdAndQuantity.getValue());

            cart.getCartItems().add(cartItem);
        }

        cartRepo.save(cart);
    }

    public AvailableQuantityResponseDto checkStock(CheckStockDto product){
        ProductVarient productVarient = productVarientRepo.findByVarientId(product.getVariantId()).orElseThrow(() -> new ResourceNotFoundException("The Product Variant Not Found"));
        return new AvailableQuantityResponseDto(
                productVarient.getVarientId(),
                productVarient.getSize(),
                productVarient.getQuantity()
        );
    }
}
