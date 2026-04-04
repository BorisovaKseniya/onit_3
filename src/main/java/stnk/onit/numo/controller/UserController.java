package stnk.onit.numo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import stnk.onit.numo.entity.User;
import stnk.onit.numo.service.UserService;

import java.util.Map;
import stnk.onit.numo.util.JwtUtil;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class UserController {

    private final UserService userService;
    private final JwtUtil jwtUtil; // добавляем

    // Конструктор Spring автоматически внедрит зависимости
    public UserController(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }



  /*  @PostMapping("/register")
    public ResponseEntity<String> register(
            @RequestParam String email,
            @RequestParam String password)
          {

        userService.register(email, password,null);
        return ResponseEntity.ok("User registered successfully");
    }*/
  @PostMapping("/register")
  public ResponseEntity<String> register(@RequestBody Map<String, String> body) {
      String firstName = body.get("firstName");
      String secondName = body.get("secondName");
      String email = body.get("email");
      String password = body.get("password");
      Integer currencyId = 1;
      try {
          userService.register(firstName,secondName,email, password, currencyId);
      } catch (Exception e) {
          e.printStackTrace(); // для отладки
          return ResponseEntity.status(500).body("Ошибка при регистрации: " + e.getMessage());
      }
      return ResponseEntity.ok("User registered successfully");
  }
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");

        User user = userService.login(email, password);

        String token = jwtUtil.generateToken(user);
        // Возвращаем успешный ответ (пока просто ОК)
        return ResponseEntity.ok(Map.of(
                "message", "Успешный вход",
                "token", token
        ));
    }

  }


