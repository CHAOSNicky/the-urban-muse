package com.practice.loginwebapp.services;

import com.practice.loginwebapp.dtos.*;
import com.practice.loginwebapp.exceptions.ResourceNotFoundException;
import com.practice.loginwebapp.exceptions.ValueIsNullException;
import com.practice.loginwebapp.models.*;
import com.practice.loginwebapp.repositories.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;


@Service
public class CartService {

    private final CartRepo cartRepo;
    private final AccountRepo accountRepo;
    private final ProductVarientRepo productVarientRepo;
    private final CartItemRepo cartItemRepo;
    public CartService(CartRepo cartRepo, AccountRepo accountRepo, ProductVarientRepo productVarientRepo, CartItemRepo cartItemRepo) {
        this.cartRepo = cartRepo;
        this.accountRepo = accountRepo;
        this.productVarientRepo = productVarientRepo;
        this.cartItemRepo = cartItemRepo;
    }

    @Transactional
    public void addCart(AddCart addCart, Authentication authentication) {
        String email = authentication.getName();
        Account acc = accountRepo.findByEmail(email).orElseThrow(()-> new ResourceNotFoundException("User not found"));

        Cart cart = cartRepo
                .findByAccountAndCartStatus(acc, CartStatus.ACTIVE)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setAccount(acc);
                    newCart.setCartStatus(CartStatus.ACTIVE);
                    return cartRepo.save(newCart);
                });

        for(Map.Entry<Long, Long> prodIdAndQuantity : addCart.getCartProdIdAndQuantity().entrySet()){
            System.out.println(prodIdAndQuantity.getKey());
            ProductVarient productVarient = productVarientRepo
                    .findByVarientId(prodIdAndQuantity.getKey())
                    .orElseThrow(()-> new ResourceNotFoundException("Product not found"));
            CartItem cartItem = cartItemRepo
                    .findByCartAndProductVarient(cart, productVarient)
                    .map(existingCartItem -> {
                        existingCartItem.setQuantity(existingCartItem.getQuantity() + prodIdAndQuantity.getValue());
                        return existingCartItem;
                    })
                    .orElseGet(() -> {
                        CartItem updatedCartItem = new CartItem();
                        updatedCartItem.setCart(cart);
                        updatedCartItem.setProductVarient(productVarient);
                        updatedCartItem.setQuantity(prodIdAndQuantity.getValue());
                        return cartItemRepo.save(updatedCartItem);
                    });

            cart.getCartItems().add(cartItem);
        }
        System.out.println("Entered a Cart Saving Service");
        cartRepo.save(cart);
    }

    public AvailableQuantityResponseDto checkStock(CheckStockDto product){
        ProductVarient productVarient = productVarientRepo
                .findByVarientId(product.getVariantId())
                .orElseThrow(() -> new ResourceNotFoundException("The Product Variant Not Found"));
        return new AvailableQuantityResponseDto(
                productVarient.getVarientId(),
                productVarient.getSize(),
                productVarient.getQuantity()
        );
    }

    @Transactional
    public void updateCart(Authentication authentication, UpdateCartItemQuantity  updateCartItemQuantity) {
        String email = authentication.getName();
        Account acc = accountRepo
                .findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Cart cart = cartRepo
                .findByAccountAndCartStatus(acc, CartStatus.ACTIVE)
                .orElseThrow(() -> new ResourceNotFoundException("Cart Not Found"));
        CartItem cartItem = cartItemRepo
                .findByCartAndProductVarient(cart,
                        productVarientRepo.findByVarientId(
                                updateCartItemQuantity.getVariantId())
                                .orElseThrow(() -> new ResourceNotFoundException("Product Varient Not Found")))
                .orElseThrow(() -> new ResourceNotFoundException("CartItem Not Found"));

        if(updateCartItemQuantity.getQuantity() == null){
            throw new ValueIsNullException("Quantity is null in updateCartItemQuantity");
        }
        else if(updateCartItemQuantity.getQuantity() < 1){
            cartItemRepo.delete(cartItem);
        }
        else{
            cartItem.setQuantity(updateCartItemQuantity.getQuantity());
            cartItemRepo.save(cartItem);
        }
    }

    @Transactional
    public List<CartItemResponseDto> getCart(Authentication authentication) {
        String email = authentication.getName();
        Account acc = accountRepo.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Cart cart = cartRepo.findByAccountAndCartStatus(acc, CartStatus.ACTIVE)
                .orElseThrow(() -> new ResourceNotFoundException("Cart Not Found"));
        List<CartItem> cartItems = cart.getCartItems();
        List<CartItemResponseDto> cartItemResponseDtos = new ArrayList<>();

        for(CartItem cartitem : cartItems){
            ProductVarient productVarient = cartitem.getProductVarient();
            String imageObjectKeys = cartitem.getProductVarient().getProduct().getProductImageObjectKey();
            String firstImage = getFirstImage(imageObjectKeys);
            cartItemResponseDtos.add(new CartItemResponseDto(
                    productVarient.getProduct().getProductId(),
                    productVarient.getVarientId(),
                    productVarient.getProduct().getName(),
                    productVarient.getSize(),
                    productVarient.getPrice(),
                    cartitem.getQuantity(),
                    firstImage
            ));
        }
        return cartItemResponseDtos;
    }

    public String getFirstImage(String imageObjectKeys){
        String firstImg = null;
        firstImg = imageObjectKeys.split(",")[0];
        return firstImg;
    }

    @Transactional
    public void removeCart(Authentication authentication, Long productVarientId){
        Account acc = accountRepo
                .findByEmail(authentication.getName()).orElseThrow(() ->  new ResourceNotFoundException("User not found"));
        Cart cart = cartRepo
                .findByAccountAndCartStatus(acc, CartStatus.ACTIVE).orElseThrow(() -> new ResourceNotFoundException("Cart Not Found"));
        CartItem cartItem = cart.getCartItems()
                        .stream()
                                .filter(item -> item.getProductVarient().getVarientId().equals(productVarientId))
                                .findFirst()
                                .orElseThrow(() -> new ResourceNotFoundException("CartItem Not Found"));
        cart.getCartItems().remove(cartItem);
    }
}