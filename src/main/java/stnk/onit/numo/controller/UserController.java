package stnk.onit.numo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import stnk.onit.numo.entity.User;
import stnk.onit.numo.service.UserService;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
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
      String email = body.get("email");
      String password = body.get("password");
      Integer currencyId = 1;
      try {
          userService.register(email, password, currencyId);
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
        // Возвращаем успешный ответ (пока просто ОК)
        return ResponseEntity.ok(Map.of(
                "message", "Успешный вход",
                "email", user.getEmail()
        ));
    }

  }


