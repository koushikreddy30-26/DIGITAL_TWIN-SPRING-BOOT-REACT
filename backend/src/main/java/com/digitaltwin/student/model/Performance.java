package com.digitaltwin.student.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "performance")
public class Performance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Column(nullable = false)
    private String subject;

    @Column(nullable = false)
    private Double marks;

    @Column(nullable = false)
    private LocalDate date;

    public Performance() {}

    public Performance(Student student, String subject, Double marks, LocalDate date) {
        this.student = student;
        this.subject = subject;
        this.marks = marks;
        this.date = date;
    }

    public static PerformanceBuilder builder() {
        return new PerformanceBuilder();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }
    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }
    public Double getMarks() { return marks; }
    public void setMarks(Double marks) { this.marks = marks; }
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public static class PerformanceBuilder {
        private Student student;
        private String subject;
        private Double marks;
        private LocalDate date;

        public PerformanceBuilder student(Student student) { this.student = student; return this; }
        public PerformanceBuilder subject(String subject) { this.subject = subject; return this; }
        public PerformanceBuilder marks(Double marks) { this.marks = marks; return this; }
        public PerformanceBuilder date(LocalDate date) { this.date = date; return this; }
        public Performance build() {
            return new Performance(student, subject, marks, date);
        }
    }
}
