package practica.sleepTracker.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import practica.sleepTracker.Entity.SleepQuality;
import practica.sleepTracker.repository.SleepQualityRepository;
import practica.sleepTracker.service.SleepQualityService;

@RestController
@CrossOrigin(origins = "http://localhost:4200") // Разрешаем запросы с Angular
@RequestMapping("/api/sleep-quality")
public class SleepQualityController {
    private final SleepQualityService sleepQualityService;
    private final SleepQualityRepository sleepQualityRepository;

    public SleepQualityController(SleepQualityService sleepQualityService,SleepQualityRepository sleepQualityRepository) {
        this.sleepQualityService = sleepQualityService;
        this.sleepQualityRepository = sleepQualityRepository;
    }

    @PostMapping
    public ResponseEntity<SleepQuality> createSleepQuality(@RequestBody SleepQuality sleepQuality) {
        SleepQuality createdQuality = sleepQualityService.createSleepQuality(sleepQuality);
        return ResponseEntity.ok(createdQuality);
    }

    @GetMapping("/{sessionId}")
    public ResponseEntity<SleepQuality> getSleepQuality(@PathVariable Integer sessionId) {
        SleepQuality quality = sleepQualityService.getSleepQualityBySessionId(sessionId);
        return ResponseEntity.ok(quality);
    }
    @GetMapping("/user/{userName}")
    public ResponseEntity<List<SleepQuality>> getAllQualitiesByUser(@PathVariable String userName) {
    List<SleepQuality> qualities = sleepQualityRepository.findBySleepSession_UserName(userName);
    return ResponseEntity.ok(qualities);
}

    @DeleteMapping("/{sessionId}")
    public ResponseEntity<Void> deleteSleepQuality(@PathVariable Integer sessionId) {
        sleepQualityService.deleteSleepQuality(sessionId);
        return ResponseEntity.noContent().build();
    }
}