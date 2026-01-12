package com.practice.loginwebapp.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@AllArgsConstructor
public class ErrorResponse {
    private int errorCode;
    private String errorMessage;
}
