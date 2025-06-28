package practica.sleepTracker.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import practica.sleepTracker.Entity.SleepFactors;
import practica.sleepTracker.service.SleepFactorsService;

@RestController
@CrossOrigin(origins = "http://localhost:4200") // Разрешаем запросы с Angular
@RequestMapping("/api/sleep-factors")
public class SleepFactorsController {

    private final SleepFactorsService sleepFactorsService;

    public SleepFactorsController(SleepFactorsService sleepFactorsService) {
        this.sleepFactorsService = sleepFactorsService;
    }

    @PostMapping
    public ResponseEntity<SleepFactors> createSleepFactors(@RequestBody SleepFactors sleepFactors) {
        SleepFactors createdFactors = sleepFactorsService.createSleepFactors(sleepFactors);
        return ResponseEntity.ok(createdFactors);
    }

    @GetMapping("/{sessionId}")
    public ResponseEntity<SleepFactors> getSleepFactors(@PathVariable Integer sessionId) {
        SleepFactors factors = sleepFactorsService.getSleepFactorsBySessionId(sessionId);
        return ResponseEntity.ok(factors);
    }

    @DeleteMapping("/{sessionId}")
    public ResponseEntity<Void> deleteSleepFactors(@PathVariable Integer sessionId) {
        sleepFactorsService.deleteSleepFactors(sessionId);
        return ResponseEntity.noContent().build();
    }
}
