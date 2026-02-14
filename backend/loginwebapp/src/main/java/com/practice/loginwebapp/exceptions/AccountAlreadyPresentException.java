package com.practice.loginwebapp.exceptions;

public class AccountAlreadyPresentException extends RuntimeException{
    public AccountAlreadyPresentException(String message){
        super(message);
    }
}
