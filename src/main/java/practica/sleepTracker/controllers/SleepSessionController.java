package practica.sleepTracker.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import practica.sleepTracker.Entity.SleepSession;
import practica.sleepTracker.service.SleepSessionService;

//import java.time.LocalDateTime;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:4200") // Разрешаем запросы с Angular
@RequestMapping("/api/sleep-sessions")
public class SleepSessionController {
    private final SleepSessionService sleepSessionService;

    public SleepSessionController(SleepSessionService sleepSessionService) {
        this.sleepSessionService = sleepSessionService;
    }

    @PostMapping
    public ResponseEntity<SleepSession> createSleepSession(@RequestBody SleepSession sleepSession) {
        SleepSession createdSession = sleepSessionService.createSleepSession(sleepSession);
        return ResponseEntity.ok(createdSession);
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

}