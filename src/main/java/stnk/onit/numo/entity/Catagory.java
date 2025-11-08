package stnk.onit.numo.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "rubr_catagories")
@Data                 // Генерирует геттеры, сеттеры, toString, equals/hashCode
@NoArgsConstructor
public class Catagory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String name;
}
