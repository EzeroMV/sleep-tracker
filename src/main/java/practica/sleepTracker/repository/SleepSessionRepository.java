package practica.sleepTracker.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import practica.sleepTracker.Entity.SleepSession;
import practica.sleepTracker.Entity.User;

import java.util.List;

public interface SleepSessionRepository extends JpaRepository<SleepSession, Integer> {
    List<SleepSession> findByUser(User user);
}