package stnk.onit.numo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.yaml.snakeyaml.events.Event;
import stnk.onit.numo.entity.Currency;
import stnk.onit.numo.entity.User;

import java.util.Optional;

public interface CurrencyRepository extends JpaRepository<Currency, Integer> {
    Optional<Currency> findById(Event.ID id);

}