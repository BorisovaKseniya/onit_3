package stnk.onit.numo;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import stnk.onit.numo.entity.Currency;
import stnk.onit.numo.entity.User;
import stnk.onit.numo.repository.UserRepository;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();

        Currency currency = new Currency();
        currency.setId(1);
        currency.setName("rub");
        currency.setSymbol("USD");
        User user = new User();
        user.setEmail("testuser@t");
        user.setFirstName("Test name");
        user.setSecondName("Test surname");
        user.setDefaultCurrency(currency);
        user.setPassword(passwordEncoder.encode("12345"));
        userRepository.save(user);
    }

    @Test
    void loginShouldReturn200() throws Exception {
        String json = """
                {
                  "email": "testuser@t",
                  "password": "12345"
                }
                """;

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk());
    }
}
