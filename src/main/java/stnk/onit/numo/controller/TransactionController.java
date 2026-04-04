package stnk.onit.numo.controller;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import stnk.onit.numo.repository.TransactionRepository;
import stnk.onit.numo.repository.UserRepository;
import stnk.onit.numo.service.TransactionService;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Map;

@RestController
@RequestMapping("/transaction")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class TransactionController {
    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;

    }

    @PostMapping("/save")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body){
        String type = body.get("type");
        Float amount = Float.parseFloat(body.get("amount"));
        String category = body.get("category");
        String description = body.get("description");
        String dateString = body.get("date"); // например "2025-11-10"
        String email = body.get("email");
        // преобразуем строку в дату
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
        Date date;
        try{
            date = formatter.parse(dateString);
        } catch (Exception e){
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Invalid date format");
        }

        try{
            transactionService.save(type, amount, category, description, date, email);
        } catch (Exception e) {
            e.printStackTrace(); // для отладки
            return ResponseEntity.status(500).body("Ошибка при регистрации: " + e.getMessage());
        }
        return ResponseEntity.ok("Transaction saved");
    }
}
