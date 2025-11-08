package stnk.onit.numo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import stnk.onit.numo.entity.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    boolean existsUserByEmail(String email);
    Optional<User> findByEmail(String email);

}
