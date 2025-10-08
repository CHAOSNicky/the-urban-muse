package com.practice.loginwebapp.controllers;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.practice.loginwebapp.models.AddProduct;
import com.practice.loginwebapp.services.DataService;
import com.practice.loginwebapp.util.JwtUtil;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/protected")
//@CrossOrigin("http://127.0.0.1:63342")
public class DataApi {

    @Autowired
    JwtUtil jwtutil;

    @Autowired
    DataService dataservice;


    @GetMapping("/data")
    public ResponseEntity<Map<String, String>> data(HttpServletRequest request){

        System.out.println("Hello from DataApi");

        Map<String, String> map = new HashMap<>();

        String token = null;
        String authHeader = request.getHeader("Authorization");

        if(authHeader != null && authHeader.startsWith("Bearer ")){
            token = authHeader.substring(7);
        }
        else if(request.getCookies() != null){
            for(Cookie c : request.getCookies()){
                if("token".equals(c.getName())){
                    token = c.getValue();
                    break;
                }
            }
        }

        String username = jwtutil.extractUsername(token);

        System.out.println(username);

        map.put("username", username);
        map.put("data", "Developed by Nickyy");

        return ResponseEntity.ok(map);

    }

    @PostMapping("/addproduct")
    public ResponseEntity<?> addProduct(@RequestBody AddProduct addproduct){

        System.out.println("Entered the DataApi");
        boolean result = dataservice.addProducts(addproduct);

        if(result){
            return ResponseEntity.ok("Product Successfully Saved");
        }
        else{
            return (ResponseEntity<?>)ResponseEntity.status(HttpStatus.BAD_REQUEST);
        }
        
    }

    

}
