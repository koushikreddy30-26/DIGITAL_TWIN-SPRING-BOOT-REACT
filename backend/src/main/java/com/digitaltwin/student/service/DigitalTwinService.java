package com.digitaltwin.student.service;

import com.digitaltwin.student.model.*;
import com.digitaltwin.student.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class DigitalTwinService {
    @Autowired
    private PerformanceRepository performanceRepository;

    @Autowired
    private ActivityRepository activityRepository;

    @Autowired
    private PredictionRepository predictionRepository;

    @Autowired
    private StudentRepository studentRepository;

    public Prediction generatePrediction(Student student) {
        List<Performance> performances = performanceRepository.findByStudentId(student.getId());
        List<Activity> activities = activityRepository.findByStudentId(student.getId());

        if (performances.isEmpty() || activities.isEmpty()) {
            return null;
        }

        Activity latestActivity = activities.get(activities.size() - 1);
        double currentAttendance = latestActivity.getAttendance();
        double currentStudyHours = latestActivity.getStudyHours();

        double avgMarks = performances.stream()
                .mapToDouble(Performance::getMarks)
                .average()
                .orElse(0.0);

        // ML: Linear Regression
        List<Double> historicalStudyHours = activities.stream()
                .map(Activity::getStudyHours)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
        List<Double> historicalMarks = performances.stream()
                .map(Performance::getMarks)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

        double predictedBase = avgMarks;
        if (historicalStudyHours.size() >= 2 && historicalMarks.size() >= 2) {
            int minSize = Math.min(historicalStudyHours.size(), historicalMarks.size());
            List<Double> alignedX = historicalStudyHours.subList(historicalStudyHours.size() - minSize, historicalStudyHours.size());
            List<Double> alignedY = historicalMarks.subList(historicalMarks.size() - minSize, historicalMarks.size());
            predictedBase = LinearRegressionUtil.predict(alignedX, alignedY, currentStudyHours);
            if (predictedBase < 0 || predictedBase > 100) predictedBase = avgMarks;
        }

        double predictedScore = (0.6 * predictedBase) + (0.3 * currentAttendance) + (0.1 * (currentStudyHours * 10));
        predictedScore = Math.min(100.0, Math.max(0.0, predictedScore));

        Prediction.RiskLevel riskLevel;
        if (predictedScore >= 75) {
            riskLevel = Prediction.RiskLevel.LOW_RISK;
        } else if (predictedScore >= 50) {
            riskLevel = Prediction.RiskLevel.MEDIUM_RISK;
        } else {
            riskLevel = Prediction.RiskLevel.HIGH_RISK;
        }

        Prediction prediction = Prediction.builder()
                .student(student)
                .predictedScore(predictedScore)
                .riskLevel(riskLevel)
                .createdAt(LocalDateTime.now())
                .build();

        return predictionRepository.save(prediction);
    }

    public List<String> getRecommendations(Student student) {
        Prediction latestPrediction = predictionRepository.findByStudentId(student.getId())
                .stream().reduce((first, second) -> second).orElse(null);

        if (latestPrediction == null) return List.of("Start tracking your daily activities to get AI-powered insights.");

        List<String> recommendations = new java.util.ArrayList<>();
        List<Performance> performances = performanceRepository.findByStudentId(student.getId());
        List<Activity> activities = activityRepository.findByStudentId(student.getId());

        // Find weak subjects (below 60)
        performances.stream()
                .collect(Collectors.groupingBy(Performance::getSubject,
                        Collectors.averagingDouble(Performance::getMarks)))
                .entrySet().stream()
                .filter(e -> e.getValue() < 60)
                .forEach(e -> recommendations.add("⚠️ Focus on " + e.getKey() + " — your average is only " + String.format("%.1f", e.getValue()) + "%. Allocate extra study time."));

        // Activity-based smart recommendations
        if (!activities.isEmpty()) {
            Activity latest = activities.get(activities.size() - 1);
            double avgStudy = activities.stream().mapToDouble(Activity::getStudyHours).average().orElse(0);
            double avgSleep = activities.stream().mapToDouble(Activity::getSleepHours).average().orElse(0);
            double avgAttendance = activities.stream().mapToDouble(Activity::getAttendance).average().orElse(0);
            double avgFocus = activities.stream().mapToInt(Activity::getFocusLevel).average().orElse(0);

            if (avgStudy < 4) {
                recommendations.add("📚 Your average study time is " + String.format("%.1f", avgStudy) + "hrs. Increase to 5-6 hours daily for better scores.");
            } else if (avgStudy < 6) {
                recommendations.add("📖 Good effort! You study " + String.format("%.1f", avgStudy) + "hrs/day on average. Push to 6+ hours to reach top performance.");
            }

            if (avgAttendance < 75) {
                recommendations.add("🔴 Attendance alert: " + String.format("%.1f", avgAttendance) + "% — below 75% threshold. Risk of academic penalty detected.");
            } else if (avgAttendance < 85) {
                recommendations.add("🟡 Attendance is " + String.format("%.1f", avgAttendance) + "%. Aim for 90%+ to maximize learning.");
            }

            if (avgSleep < 6) {
                recommendations.add("😴 Sleep deficit detected: " + String.format("%.1f", avgSleep) + "hrs average. 7-8 hours of sleep improves memory retention by 40%.");
            }

            if (avgFocus < 5) {
                recommendations.add("🧠 Focus level is low (" + String.format("%.0f", avgFocus) + "/10). Try the Pomodoro technique: 25min study, 5min break.");
            }

            // Trend analysis
            if (activities.size() >= 3) {
                double recentAvg = activities.subList(Math.max(0, activities.size() - 3), activities.size())
                        .stream().mapToDouble(Activity::getStudyHours).average().orElse(0);
                double olderAvg = activities.subList(0, Math.min(3, activities.size()))
                        .stream().mapToDouble(Activity::getStudyHours).average().orElse(0);
                if (recentAvg > olderAvg + 0.5) {
                    recommendations.add("📈 Great trend! Your study hours are increasing. Keep this momentum going.");
                } else if (recentAvg < olderAvg - 0.5) {
                    recommendations.add("📉 Warning: Study hours are declining. This may affect your predicted score.");
                }
            }
        }

        if (latestPrediction.getPredictedScore() >= 85) {
            recommendations.add("🌟 Excellent performance! You're in the top tier. Maintain consistency to stay ahead.");
        }

        if (recommendations.isEmpty()) {
            recommendations.add("✅ Great job! Your metrics look healthy. Keep maintaining your current routine.");
        }

        return recommendations;
    }

    public Map<String, Object> getComparison(Student student) {
        Map<String, Object> comparison = new HashMap<>();

        // Current student's stats
        List<Performance> myPerformances = performanceRepository.findByStudentId(student.getId());
        List<Activity> myActivities = activityRepository.findByStudentId(student.getId());

        double myAvgMarks = myPerformances.stream().mapToDouble(Performance::getMarks).average().orElse(0);
        double myAvgStudy = myActivities.stream().mapToDouble(Activity::getStudyHours).average().orElse(0);
        double myAvgAttendance = myActivities.stream().mapToDouble(Activity::getAttendance).average().orElse(0);

        // All students' stats (platform average simulating "Top Students")
        List<Performance> allPerformances = performanceRepository.findAll();
        List<Activity> allActivities = activityRepository.findAll();

        double topAvgMarks = allPerformances.stream().mapToDouble(Performance::getMarks).average().orElse(0);
        // Simulate top students being ~10% higher
        double topStudentMarks = Math.min(100, topAvgMarks * 1.10);
        double topAvgStudy = allActivities.stream().mapToDouble(Activity::getStudyHours).average().orElse(0);
        double topStudentStudy = topAvgStudy * 1.15;
        double topAvgAttendance = allActivities.stream().mapToDouble(Activity::getAttendance).average().orElse(0);
        double topStudentAttendance = Math.min(100, topAvgAttendance * 1.05);

        comparison.put("yourMarks", Math.round(myAvgMarks * 10.0) / 10.0);
        comparison.put("topMarks", Math.round(topStudentMarks * 10.0) / 10.0);
        comparison.put("yourStudyHours", Math.round(myAvgStudy * 10.0) / 10.0);
        comparison.put("topStudyHours", Math.round(topStudentStudy * 10.0) / 10.0);
        comparison.put("yourAttendance", Math.round(myAvgAttendance * 10.0) / 10.0);
        comparison.put("topAttendance", Math.round(topStudentAttendance * 10.0) / 10.0);

        return comparison;
    }
}
