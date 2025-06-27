package practica.sleepTracker.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import practica.sleepTracker.Entity.SleepFactors;
import practica.sleepTracker.Entity.SleepSession;

public interface SleepFactorsRepository extends JpaRepository<SleepFactors, Integer> {
    SleepFactors findBySleepSession(SleepSession sleepSession);
}
