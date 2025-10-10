package com.practice.loginwebapp.util;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.AddressException;
import org.springframework.stereotype.Component;

@Component
public class CleanEmail {

    public static String cleanEmailOrThrow(String raw) throws AddressException {
        String email = raw == null ? "" : raw.trim();
        if (email.contains("\r") || email.contains("\n")) throw new AddressException("CRLF not allowed");
        InternetAddress addr = new InternetAddress(email, true);
        addr.validate();
        return addr.getAddress();
    }

}
