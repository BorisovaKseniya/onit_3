package stnk.onit.numo.util;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;
import stnk.onit.numo.entity.User;

import java.security.Key;
import java.util.Date;
@Component
public class JwtUtil {
    private final Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256);// секрет для подписи
    private final long EXPIRATION_TIME = 1000 * 60 * 60; // 1 час

    public String   generateToken(User user) {
        return Jwts.builder()
                .setSubject(user.getEmail())
                .claim("firstName", user.getFirstName())
                .claim("secondName", user.getSecondName())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(SignatureAlgorithm.HS256, key)
                .compact();
    }
}
