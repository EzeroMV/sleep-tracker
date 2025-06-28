package practica.sleepTracker.service;

import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import practica.sleepTracker.Entity.SleepQuality;
import practica.sleepTracker.Entity.SleepSession;
import practica.sleepTracker.repository.SleepQualityRepository;
import practica.sleepTracker.repository.SleepSessionRepository;

@Service
public class SleepQualityService {

    private final SleepQualityRepository sleepQualityRepository;
    private final SleepSessionRepository sleepSessionRepository;

    public SleepQualityService(SleepQualityRepository sleepQualityRepository,
            SleepSessionRepository sleepSessionRepository) {
        this.sleepQualityRepository = sleepQualityRepository;
        this.sleepSessionRepository = sleepSessionRepository;
    }

    @Transactional
    public SleepQuality createSleepQuality(SleepQuality sleepQuality) {
        // Проверяем существование сессии сна
        SleepSession session = sleepSessionRepository.findById(sleepQuality.getSessionId())
                .orElseThrow(() -> new IllegalArgumentException("Сессия сна не найдена"));

        // Проверяем, не существует ли уже записи о качестве сна для этой сессии
        if (sleepQualityRepository.existsById(session.getSessionId())) {
            throw new IllegalArgumentException("Запись о качестве сна для этой сессии уже существует");
        }

        // Создаем новую сущность
        SleepQuality newQuality = new SleepQuality();
        newQuality.setFeelingScore(sleepQuality.getFeelingScore());
        newQuality.setSleepScore(sleepQuality.getSleepScore());
        newQuality.setWakeupCount(sleepQuality.getWakeupCount());
        newQuality.setSleepSession(session); // sessionId будет установлен автоматически благодаря @MapsId

        return sleepQualityRepository.saveAndFlush(newQuality);
    }

    public SleepQuality getSleepQualityBySessionId(Integer sessionId) {
        return sleepQualityRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Данные о качестве сна не найдены"));
    }

    @Transactional
    public void deleteSleepQuality(Integer sessionId) {
        SleepQuality quality = sleepQualityRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Данные о качестве сна не найдены"));

        // Разрываем связь с SleepSession
        SleepSession session = quality.getSleepSession();
        if (session != null) {
            session.setSleepQuality(null);
        }

        sleepQualityRepository.delete(quality);
    }
}
