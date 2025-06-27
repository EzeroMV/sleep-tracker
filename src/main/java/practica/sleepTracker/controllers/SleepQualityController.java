package practica.sleepTracker.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import practica.sleepTracker.Entity.SleepQuality;
import practica.sleepTracker.service.SleepQualityService;

@RestController
@CrossOrigin(origins = "http://localhost:4200") // Разрешаем запросы с Angular
@RequestMapping("/api/sleep-quality")
public class SleepQualityController {
    private final SleepQualityService sleepQualityService;

    public SleepQualityController(SleepQualityService sleepQualityService) {
        this.sleepQualityService = sleepQualityService;
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

    @DeleteMapping("/{sessionId}")
    public ResponseEntity<Void> deleteSleepQuality(@PathVariable Integer sessionId) {
        sleepQualityService.deleteSleepQuality(sessionId);
        return ResponseEntity.noContent().build();
    }
}