package stnk.onit.numo.service;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import stnk.onit.numo.entity.Currency;
import stnk.onit.numo.entity.User;
import stnk.onit.numo.repository.CurrencyRepository;
import stnk.onit.numo.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final CurrencyRepository currencyRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository,CurrencyRepository currencyRepository,PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.currencyRepository =currencyRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User register(String firstName,String secondName,String email, String rawPassword, Integer currencyId) {
        Currency currency = currencyRepository.findById(currencyId)
                .orElseThrow(() -> new IllegalArgumentException("Unknown currency ID"));

        if(userRepository.existsUserByEmail(email)){
            throw new RuntimeException("User already exists");
        }
        User user = User.builder()
                .firstName(firstName)
                .secondName(secondName)
                .email(email)
                .password(passwordEncoder.encode(rawPassword))
                .defaultCurrency(currency).build();
        return userRepository.save(user);
    }
    public User login(String email, String rawPassword) {
        // 1. Находим пользователя по email
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Пользователь не найден"));

        // 2. Проверяем пароль (сравнение с хэшем)
        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Неверный пароль");
        }


        // 3. Если всё ок — возвращаем пользователя
        return user;
    }
}

