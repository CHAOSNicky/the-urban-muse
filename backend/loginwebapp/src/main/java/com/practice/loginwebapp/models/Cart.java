package com.practice.loginwebapp.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@NoArgsConstructor
@Getter
@Setter
public class Cart {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long cartId;

    @Enumerated(EnumType.STRING)
    private CartStatus cartStatus;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="accountId")
    private Account account;

    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL)
    private List<CartItem> cartItems =  new ArrayList<>();
}
