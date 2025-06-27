package practica.sleepTracker.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import practica.sleepTracker.Entity.SleepQuality;
import practica.sleepTracker.Entity.SleepSession;

public interface SleepQualityRepository extends JpaRepository<SleepQuality, Integer> {
    SleepQuality findBySleepSession(SleepSession sleepSession);
}


