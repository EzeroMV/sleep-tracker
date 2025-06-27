package practica.sleepTracker.service;

//mport org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import practica.sleepTracker.Entity.SleepFactors;
import practica.sleepTracker.Entity.SleepSession;
import practica.sleepTracker.repository.SleepFactorsRepository;
import practica.sleepTracker.repository.SleepSessionRepository;

@Service
public class SleepFactorsService {
    private final SleepFactorsRepository sleepFactorsRepository;
    private final SleepSessionRepository sleepSessionRepository;

    public SleepFactorsService(SleepFactorsRepository sleepFactorsRepository,
                              SleepSessionRepository sleepSessionRepository) {
        this.sleepFactorsRepository = sleepFactorsRepository;
        this.sleepSessionRepository = sleepSessionRepository;
    }

    @Transactional
public SleepFactors createSleepFactors(SleepFactors sleepFactors) {
    // Проверяем существование сессии сна
    SleepSession session = sleepSessionRepository.findById(sleepFactors.getSessionId())
            .orElseThrow(() -> new IllegalArgumentException("Сессия сна не найдена"));
    
    if (sleepFactorsRepository.existsById(session.getSessionId())) {
        throw new IllegalArgumentException("Факторы сна для этой сессии уже существуют");
    }
    
    SleepFactors newFactors = new SleepFactors();
    newFactors.setCoffee(sleepFactors.getCoffee());
    newFactors.setAlcohol(sleepFactors.getAlcohol());
    newFactors.setStressScore(sleepFactors.getStressScore());
    newFactors.setPhysicalActivity(sleepFactors.getPhysicalActivity());
    newFactors.setSleepSession(session); // Устанавливаем связь с сессией
    
    return sleepFactorsRepository.saveAndFlush(newFactors);
    }

    public SleepFactors getSleepFactorsBySessionId(Integer sessionId) {
        return sleepFactorsRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Факторы сна не найдены"));
    }

    @Transactional
public void deleteSleepFactors(Integer sessionId) {
    SleepFactors factors = sleepFactorsRepository.findById(sessionId)
        .orElseThrow(() -> new IllegalArgumentException("Факторы сна не найдены"));
    
    // Разрываем связь с SleepSession
    SleepSession session = factors.getSleepSession();
    if (session != null) {
        session.setSleepFactors(null);
    }
    
    sleepFactorsRepository.delete(factors);
}
}
