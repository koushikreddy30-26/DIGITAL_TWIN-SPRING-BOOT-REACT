package com.digitaltwin.student.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "predictions")
public class Prediction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Column(name = "predicted_score", nullable = false)
    private Double predictedScore;

    @Enumerated(EnumType.STRING)
    @Column(name = "risk_level", nullable = false)
    private RiskLevel riskLevel;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    public enum RiskLevel {
        LOW_RISK, MEDIUM_RISK, HIGH_RISK
    }

    public Prediction() {}

    public Prediction(Student student, Double predictedScore, RiskLevel riskLevel, LocalDateTime createdAt) {
        this.student = student;
        this.predictedScore = predictedScore;
        this.riskLevel = riskLevel;
        this.createdAt = createdAt;
    }

    public static PredictionBuilder builder() {
        return new PredictionBuilder();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }
    public Double getPredictedScore() { return predictedScore; }
    public void setPredictedScore(Double predictedScore) { this.predictedScore = predictedScore; }
    public RiskLevel getRiskLevel() { return riskLevel; }
    public void setRiskLevel(RiskLevel riskLevel) { this.riskLevel = riskLevel; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static class PredictionBuilder {
        private Student student;
        private Double predictedScore;
        private RiskLevel riskLevel;
        private LocalDateTime createdAt;

        public PredictionBuilder student(Student student) { this.student = student; return this; }
        public PredictionBuilder predictedScore(Double predictedScore) { this.predictedScore = predictedScore; return this; }
        public PredictionBuilder riskLevel(RiskLevel riskLevel) { this.riskLevel = riskLevel; return this; }
        public PredictionBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public Prediction build() {
            return new Prediction(student, predictedScore, riskLevel, createdAt);
        }
    }
}
