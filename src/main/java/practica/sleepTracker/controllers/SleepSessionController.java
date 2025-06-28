package practica.sleepTracker.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import practica.sleepTracker.Entity.SleepSession;
import practica.sleepTracker.dto.SleepDurationWithScore;
import practica.sleepTracker.repository.SleepSessionRepository;
import practica.sleepTracker.service.SleepSessionService;

//import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:4200") // Разрешаем запросы с Angular
@RequestMapping("/api/sleep-sessions")
public class SleepSessionController {

    private final SleepSessionService sleepSessionService;
    private final SleepSessionRepository sleepSessionRepository;

    public SleepSessionController(SleepSessionService sleepSessionService, SleepSessionRepository sleepSessionRepository) {
        this.sleepSessionService = sleepSessionService;
        this.sleepSessionRepository = sleepSessionRepository;
    }

    @PostMapping
    public ResponseEntity<SleepSession> createSleepSession(@RequestBody SleepSession sleepSession) {
        SleepSession createdSession = sleepSessionService.createSleepSession(sleepSession);
        return ResponseEntity.ok(createdSession);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SleepSession> getSessionById(@PathVariable Integer id) {
        Optional<SleepSession> session = sleepSessionRepository.findById(id);
        return session.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{username}")
    public ResponseEntity<List<SleepSession>> getSleepSessionsByUser(@PathVariable String username) {
        List<SleepSession> sessions = sleepSessionService.getSleepSessionsByUser(username);
        return ResponseEntity.ok(sessions);
    }

    @DeleteMapping("/{sessionId}")
    public ResponseEntity<Void> deleteSleepSession(@PathVariable Integer sessionId) {
        sleepSessionService.deleteSleepSession(sessionId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/duration-with-quality/{userName}")
    public ResponseEntity<List<SleepDurationWithScore>> getDurationsWithQuality(@PathVariable String userName) {
        List<SleepDurationWithScore> result = sleepSessionRepository.findDurationsWithScore(userName);
        return ResponseEntity.ok(result);
    }

}
