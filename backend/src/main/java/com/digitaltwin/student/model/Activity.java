package com.digitaltwin.student.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "activities")
public class Activity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Column(name = "study_hours", nullable = false)
    private Double studyHours;

    @Column(name = "sleep_hours", nullable = false)
    private Double sleepHours;

    @Column(nullable = false)
    private Double attendance;

    @Column(name = "focus_level", nullable = false)
    private Integer focusLevel;

    @Column(nullable = false)
    private LocalDate date;

    public Activity() {}

    public Activity(Student student, Double studyHours, Double sleepHours, Double attendance, Integer focusLevel, LocalDate date) {
        this.student = student;
        this.studyHours = studyHours;
        this.sleepHours = sleepHours;
        this.attendance = attendance;
        this.focusLevel = focusLevel;
        this.date = date;
    }

    public static ActivityBuilder builder() {
        return new ActivityBuilder();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }
    public Double getStudyHours() { return studyHours; }
    public void setStudyHours(Double studyHours) { this.studyHours = studyHours; }
    public Double getSleepHours() { return sleepHours; }
    public void setSleepHours(Double sleepHours) { this.sleepHours = sleepHours; }
    public Double getAttendance() { return attendance; }
    public void setAttendance(Double attendance) { this.attendance = attendance; }
    public Integer getFocusLevel() { return focusLevel; }
    public void setFocusLevel(Integer focusLevel) { this.focusLevel = focusLevel; }
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public static class ActivityBuilder {
        private Student student;
        private Double studyHours;
        private Double sleepHours;
        private Double attendance;
        private Integer focusLevel;
        private LocalDate date;

        public ActivityBuilder student(Student student) { this.student = student; return this; }
        public ActivityBuilder studyHours(Double studyHours) { this.studyHours = studyHours; return this; }
        public ActivityBuilder sleepHours(Double sleepHours) { this.sleepHours = sleepHours; return this; }
        public ActivityBuilder attendance(Double attendance) { this.attendance = attendance; return this; }
        public ActivityBuilder focusLevel(Integer focusLevel) { this.focusLevel = focusLevel; return this; }
        public ActivityBuilder date(LocalDate date) { this.date = date; return this; }
        public Activity build() {
            return new Activity(student, studyHours, sleepHours, attendance, focusLevel, date);
        }
    }
}
