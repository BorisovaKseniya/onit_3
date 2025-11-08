package stnk.onit.numo.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "obj_users")
@Data                 // Генерирует геттеры, сеттеры, toString, equals/hashCode
@NoArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @ManyToOne
    @JoinColumn(name = "default_currency_code", nullable = false)

    private Currency defaultCurrency;




}

