package com.digitaltwin.student.repository;

import com.digitaltwin.student.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByEmail(String email);
    Boolean existsByEmail(String email);
}
