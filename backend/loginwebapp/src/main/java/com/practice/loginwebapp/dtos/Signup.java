package com.practice.loginwebapp.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Signup {
    private String fullName;
    private String email;
    private String authCode;
}
