package stnk.onit.numo.service;


import org.springframework.stereotype.Service;
import stnk.onit.numo.entity.Transaction;
import stnk.onit.numo.entity.User;
import stnk.onit.numo.repository.TransactionRepository;
import stnk.onit.numo.repository.UserRepository;


import java.util.Date;

@Service
public class TransactionService {
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    public TransactionService(TransactionRepository transactionRepository, UserRepository userRepository) {
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
    }

   public Transaction save(String type, Float amount, String category, String description, Date date, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Transaction transaction = Transaction.builder()
                .type(type)
                .amount(amount)
                .category(category)
                .description(description)
                .date(date)
                .user(user).build();
        return transactionRepository.save(transaction);
   }

}

