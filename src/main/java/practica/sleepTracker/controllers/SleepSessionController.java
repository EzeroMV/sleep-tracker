package practica.sleepTracker.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import practica.sleepTracker.Entity.SleepSession;
import practica.sleepTracker.dto.SleepDurationWithScore;
import practica.sleepTracker.repository.SleepSessionRepository;
import practica.sleepTracker.service.SleepSessionService;
import practica.sleepTracker.config.Auth;

@RestController
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
@RequestMapping("/api/sleep-sessions")
public class SleepSessionController {

    private final SleepSessionService sleepSessionService;
    private final SleepSessionRepository sleepSessionRepository;

    public SleepSessionController(SleepSessionService sleepSessionService,
            SleepSessionRepository sleepSessionRepository) {
        this.sleepSessionService = sleepSessionService;
        this.sleepSessionRepository = sleepSessionRepository;
    }

    @PostMapping
    public ResponseEntity<SleepSession> createSleepSession(@RequestBody SleepSession sleepSession,
            HttpServletRequest request) {
        Auth.unauthorizedIfNotLoggedIn(request);
        HttpSession session = request.getSession(false);
        String username = (String) session.getAttribute("username");

        sleepSession.setUserName(username); // Имя из сессии
        SleepSession createdSession = sleepSessionService.createSleepSession(sleepSession);
        return ResponseEntity.ok(createdSession);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SleepSession> getSessionById(@PathVariable Integer id, HttpServletRequest request) {
        Auth.unauthorizedIfNotLoggedIn(request);
        HttpSession session = request.getSession(false);
        String username = (String) session.getAttribute("username");

        Optional<SleepSession> sessionOpt = sleepSessionRepository.findById(id);
        if (sessionOpt.isEmpty() || !sessionOpt.get().getUserName().equals(username)) {
            return ResponseEntity.status(403).build(); // доступ запрещён
        }

        return ResponseEntity.ok(sessionOpt.get());
    }

    @GetMapping
    public ResponseEntity<List<SleepSession>> getSleepSessions(HttpServletRequest request) {
        Auth.unauthorizedIfNotLoggedIn(request);
        HttpSession session = request.getSession(false);
        String username = (String) session.getAttribute("username");

        List<SleepSession> sessions = sleepSessionService.getSleepSessionsByUser(username);
        return ResponseEntity.ok(sessions);
    }

    @DeleteMapping("/{sessionId}")
    public ResponseEntity<Void> deleteSleepSession(@PathVariable Integer sessionId, HttpServletRequest request) {
        Auth.unauthorizedIfNotLoggedIn(request);
        HttpSession session = request.getSession(false);
        String username = (String) session.getAttribute("username");

        Optional<SleepSession> sessionOpt = sleepSessionRepository.findById(sessionId);
        if (sessionOpt.isEmpty() || !sessionOpt.get().getUserName().equals(username)) {
            return ResponseEntity.status(403).build(); // доступ запрещён
        }

        sleepSessionService.deleteSleepSession(sessionId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/duration-with-quality")
    public ResponseEntity<List<SleepDurationWithScore>> getDurationsWithQuality(HttpServletRequest request) {
        Auth.unauthorizedIfNotLoggedIn(request);
        HttpSession session = request.getSession(false);
        String username = (String) session.getAttribute("username");

        List<SleepDurationWithScore> result = sleepSessionRepository.findDurationsWithScore(username);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        return ResponseEntity.ok().build();
    }
}
