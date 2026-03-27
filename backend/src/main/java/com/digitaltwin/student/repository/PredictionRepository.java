package com.digitaltwin.student.repository;

import com.digitaltwin.student.model.Prediction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PredictionRepository extends JpaRepository<Prediction, Long> {
    List<Prediction> findByStudentId(Long studentId);
}
