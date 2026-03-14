package com.practice.loginwebapp.exceptions;

public class AuthenticationIsNullException extends RuntimeException {
    public AuthenticationIsNullException(String message) {
        super(message);
    }
}
