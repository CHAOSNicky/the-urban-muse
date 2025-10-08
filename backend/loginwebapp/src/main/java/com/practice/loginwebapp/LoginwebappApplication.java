package com.practice.loginwebapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class LoginwebappApplication {

	public static void main(String[] args) {
		SpringApplication.run(LoginwebappApplication.class, args);
	}

}

