//package com.practice.loginwebapp.controllers;
//
//// import java.util.ArrayList;
//import java.util.List;
//import java.util.Map;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.CrossOrigin;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RequestParam;
//import org.springframework.web.bind.annotation.RestController;
//
//import com.practice.loginwebapp.dtos.CartRequest;
//import com.practice.loginwebapp.models.AddProduct;
//import com.practice.loginwebapp.models.Login;
//import com.practice.loginwebapp.models.CartProduct;
//import com.practice.loginwebapp.repositories.LoginRepo;
//import com.practice.loginwebapp.repositories.AddProductRepo;
//import com.practice.loginwebapp.repositories.CartRepo;
//import com.practice.loginwebapp.services.CartService;
//
//@RestController
////@CrossOrigin(origins = "http://127.0.0.1:63342")
//@RequestMapping("/api/cart")
//public class CartController {
//
//    @Autowired
//    CartService cartservice;
//
//    @Autowired
//    AddProductRepo addproductrepo;
//
//    @Autowired
//    LoginRepo loginrepo;
//
//    @Autowired
//    CartRepo cartrepo;
//
//    @PostMapping("/add")
//    public ResponseEntity<?> addCart(@RequestBody CartRequest cartrequest){
//
//        System.out.println(cartrequest.getProductId());
//        System.out.println(cartrequest.getUsername());
//
//        AddProduct product = addproductrepo.findById(cartrequest.getProductId())
//                                           .orElseThrow(() -> new RuntimeException("ProductNotFound"));
//
//        Login user = loginrepo.findByUsername(cartrequest.getUsername())
//                          .orElseThrow(() -> new RuntimeException("User Not Found"));
//
//        CartProduct cartproduct = new CartProduct();
//
//        System.out.println(product);
//        System.out.println(user);
//
//        cartproduct.setUser(user);
//        cartproduct.setProduct(product);
//
//        cartrepo.save(cartproduct);
//
//        return ResponseEntity.ok("");
//    }
//
//
//    @GetMapping("/list")
//    public ResponseEntity<List<AddProduct>> listProducts(){
//
//        List<AddProduct> cartitems = cartservice.listItems();
//        return ResponseEntity.ok(cartitems);
//    }
//
//    @GetMapping("/cartproduct")
//    public ResponseEntity<List<AddProduct>> getCartProduct(@RequestParam String username){
//
//        Login user = loginrepo.findByUsername(username).orElse(new Login(0, null,null));
//
//        List<AddProduct> result = cartservice.getCartProduct(user);
//
//        return ResponseEntity.ok(result);
//    }
//
//    @GetMapping("/available")
//    public ResponseEntity<Map<String, Integer>> stockcheck(@RequestParam int productid, int currentquantity ){
//
//        return ResponseEntity.ok(cartservice.stockcheck(productid, currentquantity));
//    }
//
//}
