package com.practice.loginwebapp.controllers;

import com.practice.loginwebapp.dtos.*;
import com.practice.loginwebapp.services.CartService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
public class CartController {
    private final CartService cartService;
    public CartController(CartService cartService){
        this.cartService = cartService;
    }

    @PostMapping("/add/products")
    public ResponseEntity<SuccessResposne> putCart(Authentication authentication, @RequestBody AddCart addCart) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new NullPointerException("Authentication is needed");
        }
        System.out.println("Entered a Cart Saving Controller");
        cartService.addCart(addCart, authentication);
        return ResponseEntity.status(HttpStatus.CREATED).body(new SuccessResposne("Products Added in the cart successfully"));
    }

    @PutMapping("/update")
    public ResponseEntity<SuccessResposne> updateCart(Authentication authentication, @RequestBody UpdateCartItemQuantity updateCartItemQuantity) {
        cartService.updateCart(authentication, updateCartItemQuantity);
        return ResponseEntity.status(HttpStatus.OK).body(new SuccessResposne("Product Quantity Synced successfully"));
    }

    @GetMapping("/get-cart")
    public ResponseEntity<List<CartItemResponseDto>> getCart(Authentication authentication) {
        return ResponseEntity.status(HttpStatus.OK).body(cartService.getCart(authentication));
    }

    @PostMapping("/check-stock")
    public ResponseEntity<AvailableQuantityResponseDto> checkCart(@RequestBody CheckStockDto checkStock) {
        System.out.println(checkStock.getVariantId());
        return ResponseEntity.status(HttpStatus.OK).body(cartService.checkStock(checkStock));
    }
}