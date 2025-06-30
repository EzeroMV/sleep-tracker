package practica.sleepTracker.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import practica.sleepTracker.Entity.SleepFactors;
import practica.sleepTracker.Entity.SleepSession;
import practica.sleepTracker.config.Auth;
import practica.sleepTracker.repository.SleepSessionRepository;
import practica.sleepTracker.service.SleepFactorsService;

import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/sleep-factors")
public class SleepFactorsController {

    private final SleepFactorsService sleepFactorsService;
    private final SleepSessionRepository sleepSessionRepository;

    public SleepFactorsController(SleepFactorsService sleepFactorsService,
            SleepSessionRepository sleepSessionRepository) {
        this.sleepFactorsService = sleepFactorsService;
        this.sleepSessionRepository = sleepSessionRepository;
    }

    private boolean isOwner(Integer sessionId, HttpServletRequest request) {
        Optional<SleepSession> sessionOpt = sleepSessionRepository.findById(sessionId);
        if (sessionOpt.isEmpty())
            return false;

        String loggedUser = (String) request.getSession().getAttribute("username");
        return sessionOpt.get().getUser().getUserName().equals(loggedUser);
    }

    @PostMapping
    public ResponseEntity<SleepFactors> createSleepFactors(@RequestBody SleepFactors sleepFactors,
            HttpServletRequest request) {
        Auth.unauthorizedIfNotLoggedIn(request);

        if (!isOwner(sleepFactors.getSessionId(), request)) {
            return ResponseEntity.status(403).build(); // Forbidden
        }

        SleepFactors createdFactors = sleepFactorsService.createSleepFactors(sleepFactors);
        return ResponseEntity.ok(createdFactors);
    }

    @GetMapping("/{sessionId}")
    public ResponseEntity<SleepFactors> getSleepFactors(@PathVariable Integer sessionId, HttpServletRequest request) {
        Auth.unauthorizedIfNotLoggedIn(request);

        if (!isOwner(sessionId, request)) {
            return ResponseEntity.status(403).build();
        }

        SleepFactors factors = sleepFactorsService.getSleepFactorsBySessionId(sessionId);
        return ResponseEntity.ok(factors);
    }

    @DeleteMapping("/{sessionId}")
    public ResponseEntity<Void> deleteSleepFactors(@PathVariable Integer sessionId, HttpServletRequest request) {
        Auth.unauthorizedIfNotLoggedIn(request);

        if (!isOwner(sessionId, request)) {
            return ResponseEntity.status(403).build();
        }

        sleepFactorsService.deleteSleepFactors(sessionId);
        return ResponseEntity.noContent().build();
    }
}
