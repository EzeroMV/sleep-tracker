package practica.sleepTracker.service;

import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import practica.sleepTracker.Entity.SleepSession;
import practica.sleepTracker.Entity.User;
import practica.sleepTracker.repository.SleepSessionRepository;
import practica.sleepTracker.repository.UserRepository;

//import java.time.LocalDateTime;
import java.util.List;

@Service
public class SleepSessionService {
    private final SleepSessionRepository sleepSessionRepository;
    private final UserRepository userRepository;

    public SleepSessionService(SleepSessionRepository sleepSessionRepository, UserRepository userRepository) {
        this.sleepSessionRepository = sleepSessionRepository;
        this.userRepository = userRepository;
    }

   @Transactional
public SleepSession createSleepSession(SleepSession sleepSession) {
    // 1. Проверяем, что username указан
    if (sleepSession.getUserName() == null || sleepSession.getUserName().isBlank()) {
        throw new IllegalArgumentException("Имя пользователя не может быть пустым");
    }

    // 2. Проверяем существование пользователя
    User user = userRepository.findById(sleepSession.getUserName())
            .orElseThrow(() -> new IllegalArgumentException("Пользователь не найден"));
    
    // 3. Устанавливаем связь (если нужно)
    sleepSession.setUser(user);
    
    // 4. Проверяем время
    if (sleepSession.getTimeWakeup().isBefore(sleepSession.getTimeSleep())) {
        throw new IllegalArgumentException("Время пробуждения должно быть позже времени сна");
    }
    
    // 5. Сохраняем
    return sleepSessionRepository.save(sleepSession);
}

    public List<SleepSession> getSleepSessionsByUser(String username) {
        User user = userRepository.findById(username).orElseThrow(() 
        -> new IllegalArgumentException("Пользователь не найден"));

        return sleepSessionRepository.findByUser(user);
    }

    public void deleteSleepSession(Integer sessionId) {
        sleepSessionRepository.deleteById(sessionId);
    }

}