package com.digitaltwin.student.controller;

import com.digitaltwin.student.model.*;
import com.digitaltwin.student.repository.*;
import com.digitaltwin.student.security.UserDetailsImpl;
import com.digitaltwin.student.service.DigitalTwinService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;
import java.util.HashMap;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/data")
public class StudentDataController {
    @Autowired
    private PerformanceRepository performanceRepository;

    @Autowired
    private ActivityRepository activityRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private DigitalTwinService digitalTwinService;

    @Autowired
    private PredictionRepository predictionRepository;

    @PostMapping("/performance")
    public ResponseEntity<?> addPerformance(@RequestBody Performance performance) {
        Long studentId = ((UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getId();
        Student student = studentRepository.findById(studentId).orElseThrow();
        performance.setStudent(student);
        if (performance.getDate() == null) performance.setDate(LocalDate.now());
        performanceRepository.save(performance);
        // Re-generate prediction with new data
        digitalTwinService.generatePrediction(student);
        return ResponseEntity.ok("Performance data saved.");
    }

    @PostMapping("/activity")
    public ResponseEntity<?> addActivity(@RequestBody Activity activity) {
        Long studentId = ((UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getId();
        Student student = studentRepository.findById(studentId).orElseThrow();
        activity.setStudent(student);
        if (activity.getDate() == null) activity.setDate(LocalDate.now());
        activityRepository.save(activity);
        // Trigger prediction update
        digitalTwinService.generatePrediction(student);
        return ResponseEntity.ok("Activity data saved.");
    }

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboardStats() {
        Long studentId = ((UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getId();
        Student student = studentRepository.findById(studentId).orElseThrow();

        // Always re-generate prediction so it's fresh
        Prediction freshPrediction = digitalTwinService.generatePrediction(student);

        List<Performance> performances = performanceRepository.findByStudentId(studentId);
        List<Activity> activities = activityRepository.findByStudentId(studentId);

        var stats = new HashMap<String, Object>();
        stats.put("user", new HashMap<String, Object>() {{
            put("name", student.getName());
            put("email", student.getEmail());
        }});
        stats.put("performances", performances);
        stats.put("activities", activities);
        stats.put("latestPrediction", freshPrediction != null ? freshPrediction :
                predictionRepository.findByStudentId(studentId).stream()
                        .reduce((first, second) -> second).orElse(null));
        stats.put("recommendations", digitalTwinService.getRecommendations(student));

        // Comparison: average of all students vs this student
        stats.put("comparison", digitalTwinService.getComparison(student));

        // Goal tracking
        double currentScore = freshPrediction != null ? freshPrediction.getPredictedScore() : 0;
        stats.put("goalTracker", new HashMap<String, Object>() {{
            put("target", 90.0);
            put("current", currentScore);
            put("progress", Math.min(100.0, (currentScore / 90.0) * 100));
        }});

        return ResponseEntity.ok(stats);
    }
}
