package com.practice.loginwebapp.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Login {

        

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private int id;

        @Column(unique = true)
        private String username;

        private String password;


        
        // public Login() {
        //         System.out.println("Entered Custom Model Class");
        //     }

        // public Login(String username, String password) {
        //         this.username = username;
        //         this.password = password;
        //         System.out.println("Entered Argument Model Class");
        //     }


        // public Login(String username, String password){
        //     // System.out.println(
        //     //         "I'm here in DTD"
        //     //     );
        //     // System.out.println(username + " " + password);
        //     this.username = username;
        //     this.password = password;
        // }

        // public Login(){
        //         System.out.println(
        //             "I'm here"
        //         );
        // }

          // @Override
          //   public String toString() {
          //       return "Product [id=" + id + ", name=" + username + ", password=" + password + "]";
          //   }

}
