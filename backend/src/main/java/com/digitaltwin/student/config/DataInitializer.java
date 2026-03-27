package com.digitaltwin.student.config;

import com.digitaltwin.student.model.*;
import com.digitaltwin.student.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.time.LocalDate;
import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(StudentRepository studentRepository, 
                                 PerformanceRepository performanceRepository,
                                 ActivityRepository activityRepository,
                                 PasswordEncoder passwordEncoder) {
        return args -> {
            if (studentRepository.count() > 0) return;

            // 1. Create a Test Student
            Student student = Student.builder()
                .name("Koushik Reddy")
                .email("koushik@example.com")
                .password(passwordEncoder.encode("123456"))
                .role(Student.Role.STUDENT)
                .build();
            studentRepository.save(student);

            // 2. Add Performance Data (Subjects)
            performanceRepository.saveAll(List.of(
                new Performance(student, "Mathematics", 85.0, LocalDate.now().minusMonths(1)),
                new Performance(student, "Physics", 78.0, LocalDate.now().minusMonths(1)),
                new Performance(student, "Computer Science", 92.0, LocalDate.now().minusMonths(1)),
                new Performance(student, "Mathematics", 88.0, LocalDate.now()),
                new Performance(student, "Physics", 82.0, LocalDate.now())
            ));

            // 3. Add Activity Data (Last 7 days)
            for (int i = 6; i >= 0; i--) {
                activityRepository.save(Activity.builder()
                    .student(student)
                    .studyHours(4.0 + Math.random() * 4) // 4 to 8 hours
                    .sleepHours(6.0 + Math.random() * 2) // 6 to 8 hours
                    .attendance(85.0 + Math.random() * 15) // 85 to 100 %
                    .focusLevel((int)(6 + Math.random() * 4)) // 6 to 10
                    .date(LocalDate.now().minusDays(i))
                    .build());
            }

            System.out.println("Database seeded with sample student data!");
        };
    }
}
