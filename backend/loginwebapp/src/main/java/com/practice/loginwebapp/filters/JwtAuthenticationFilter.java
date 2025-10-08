package com.practice.loginwebapp.filters;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

// import com.practice.loginwebapp.services.CustomUserDetailsService;
// import com.practice.loginwebapp.services.LoginService;
import com.practice.loginwebapp.util.JwtUtil;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
   @Autowired
   private JwtUtil jwtUtil;

   @Autowired
   private UserDetailsService userdetailservice;

   // public endpoints to skip (login, signup, swagger/h2-console etc.)
   private static final List<String> EXCLUDE_URLS = List.of(
           "/api/login/**",
           "/api/signup/**",
           "/api/otp/generate/**"
        //    "/h2-console"
   );

   private final AntPathMatcher pathMatcher = new AntPathMatcher();

   @Override
   @SuppressWarnings("UseSpecificCatch")
   protected void doFilterInternal(HttpServletRequest request,
                                   HttpServletResponse response,
                                   FilterChain filterChain) throws ServletException, IOException {



            // ✅ Handle preflight OPTIONS request
            if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
                response.setStatus(HttpServletResponse.SC_OK);
                return;
            }

            // ✅ Allow public endpoints to pass through
            String path = request.getRequestURI();
            
            if (EXCLUDE_URLS.stream().anyMatch(pattern -> pathMatcher.match(pattern, path))) {
                System.out.println("JwtAuthenticationFilter triggered for path: " + path);
                filterChain.doFilter(request, response);
                return;
            }



       // 2) Extract token (prefer Authorization header, fallback to cookie named "token")
       String token = null;
       String authHeader = request.getHeader("Authorization");
       if (authHeader != null && authHeader.startsWith("Bearer ")) {
           token = authHeader.substring(7);
       } else if (request.getCookies() != null) {
           for (Cookie c : request.getCookies()) {
               if ("token".equals(c.getName())) {
                   token = c.getValue();
                   break;
               }
           }
       }

       // 3) If token present and user not already authenticated in context, validate & set authentication
       if (token != null && SecurityContextHolder.getContext().getAuthentication() == null) {
           try {
               String username = jwtUtil.extractUsername(token);
               if (username != null) {
                    UserDetails userDetails =  userdetailservice.loadUserByUsername(username);
                   if (jwtUtil.validateToken(token, userDetails)) {
                       UsernamePasswordAuthenticationToken authentication =
                               new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                       authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                       SecurityContextHolder.getContext().setAuthentication(authentication);
                   } else {
                       // invalid token
                       response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                       response.setContentType("application/json");
                       response.getWriter().write("{\"error\":\"Invalid or expired token\"}");
                       return;
                   }
               }
           } catch (ExpiredJwtException e) {
               response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
               response.setContentType("application/json");
               response.getWriter().write("{\"error\":\"Token expired\"}");
               return;
           } catch (Exception e) {
               response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
               response.setContentType("application/json");
               response.getWriter().write("{\"error\":\"Token validation error\"}");
               return;
           }
       }

       // 4) continue filter chain
       filterChain.doFilter(request, response);
   }
}
