package com.practice.loginwebapp.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AddCart {
    private Map<Long, Long> cartProdIdAndQuantity;
}
