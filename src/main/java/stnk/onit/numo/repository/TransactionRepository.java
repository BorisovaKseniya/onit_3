package stnk.onit.numo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import stnk.onit.numo.entity.Transaction;
import stnk.onit.numo.entity.User;

import java.util.List;
import java.util.Optional;

public interface TransactionRepository extends JpaRepository<Transaction, Integer> {
    List<Transaction> findAllByUser(User user);
}
