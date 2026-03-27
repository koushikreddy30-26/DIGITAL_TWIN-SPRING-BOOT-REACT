package com.digitaltwin.student.repository;

import com.digitaltwin.student.model.Performance;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PerformanceRepository extends JpaRepository<Performance, Long> {
    List<Performance> findByStudentId(Long studentId);
}
