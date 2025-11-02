//package com.practice.loginwebapp.services;
//
//import java.util.ArrayList;
//import java.util.HashMap;
//import java.util.List;
//import java.util.Map;
//import java.util.Optional;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import com.practice.loginwebapp.models.AddProduct;
//import com.practice.loginwebapp.models.CartProduct;
//import com.practice.loginwebapp.models.Login;
//import com.practice.loginwebapp.repositories.AddProductRepo;
//import com.practice.loginwebapp.repositories.CartRepo;
//
//@Service
//public class CartService {
//
//        @Autowired
//        CartRepo cartrepo;
//
//        @Autowired
//        AddProductRepo addproductrepo;
//
//        public void addProductToCart(Login user, AddProduct product){
//
//            CartProduct cartproduct = new CartProduct();
//
//            cartproduct.setUser(user);
//            cartproduct.setProduct(product);
//
//            cartrepo.save(cartproduct);
//
//        }
//
//        public List<AddProduct> listItems(){
//            return addproductrepo.findAll();
//        }
//
//
//        public List<AddProduct> getCartProduct(Login user){
//
//                List<AddProduct> finalcart = new ArrayList<>();
//
//                List<CartProduct> result = cartrepo.findByUser(user);
//
//                for(CartProduct cartProduct : result) {
//                    AddProduct product = cartProduct.getProduct();
//                    long prodid = product.getProduct_id();
//                    addproductrepo.findById(prodid).ifPresent(finalcart::add);
//                }
//
//                return finalcart;
//        }
//
//
//        public Map<String, Integer> stockcheck(int productid, int currentquantity){
//
//            Map<String, Integer> stockresponse = new HashMap<>();
//
//            Optional<AddProduct> stock = addproductrepo.findById(productid);
//
//            if(stock.isPresent()){
//                AddProduct stockproduct = stock.get();
//                int productquantity = stockproduct.getProductQuantity();
//
//                if(currentquantity <= productquantity){
//                    stockresponse.put("productid", productid);
//                    return stockresponse;
//                }
//                else{
//                    stockresponse.put("error", -1);
//                    return stockresponse;
//                }
//            }
//            else{
//                stockresponse.put("error", -2);
//                return stockresponse;
//            }
//
//        }
//}
