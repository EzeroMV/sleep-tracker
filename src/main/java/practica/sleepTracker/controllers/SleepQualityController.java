package practica.sleepTracker.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import practica.sleepTracker.Entity.SleepQuality;
import practica.sleepTracker.Entity.SleepSession;
import practica.sleepTracker.config.Auth;
import practica.sleepTracker.repository.SleepQualityRepository;
import practica.sleepTracker.repository.SleepSessionRepository;
import practica.sleepTracker.service.SleepQualityService;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/sleep-quality")
public class SleepQualityController {

    private final SleepQualityService sleepQualityService;
    private final SleepQualityRepository sleepQualityRepository;
    private final SleepSessionRepository sleepSessionRepository;

    public SleepQualityController(SleepQualityService sleepQualityService,
            SleepQualityRepository sleepQualityRepository,
            SleepSessionRepository sleepSessionRepository) {
        this.sleepQualityService = sleepQualityService;
        this.sleepQualityRepository = sleepQualityRepository;
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
    public ResponseEntity<SleepQuality> createSleepQuality(@RequestBody SleepQuality sleepQuality,
            HttpServletRequest request) {
        Auth.unauthorizedIfNotLoggedIn(request);

        if (!isOwner(sleepQuality.getSessionId(), request)) {
            return ResponseEntity.status(403).build();
        }

        SleepQuality createdQuality = sleepQualityService.createSleepQuality(sleepQuality);
        return ResponseEntity.ok(createdQuality);
    }

    @GetMapping("/{sessionId}")
    public ResponseEntity<SleepQuality> getSleepQuality(@PathVariable Integer sessionId,
            HttpServletRequest request) {
        Auth.unauthorizedIfNotLoggedIn(request);

        if (!isOwner(sessionId, request)) {
            return ResponseEntity.status(403).build();
        }

        SleepQuality quality = sleepQualityService.getSleepQualityBySessionId(sessionId);
        return ResponseEntity.ok(quality);
    }

    @GetMapping("/user/{userName}")
    public ResponseEntity<List<SleepQuality>> getAllQualitiesByUser(@PathVariable String userName,
            HttpServletRequest request) {
        Auth.unauthorizedIfNotLoggedIn(request);

        String loggedUser = (String) request.getSession().getAttribute("username");
        if (!loggedUser.equals(userName)) {
            return ResponseEntity.status(403).build();
        }

        List<SleepQuality> qualities = sleepQualityRepository.findBySleepSession_UserName(userName);
        return ResponseEntity.ok(qualities);
    }

    @DeleteMapping("/{sessionId}")
    public ResponseEntity<Void> deleteSleepQuality(@PathVariable Integer sessionId,
            HttpServletRequest request) {
        Auth.unauthorizedIfNotLoggedIn(request);

        if (!isOwner(sessionId, request)) {
            return ResponseEntity.status(403).build();
        }

        sleepQualityService.deleteSleepQuality(sessionId);
        return ResponseEntity.noContent().build();
    }
}
