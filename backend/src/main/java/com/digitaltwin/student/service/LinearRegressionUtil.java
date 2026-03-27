package com.digitaltwin.student.service;

import java.util.List;

/**
 * A simple utility for Simple Linear Regression.
 * Y = B0 + B1 * X
 */
public class LinearRegressionUtil {

    private LinearRegressionUtil() {
        throw new UnsupportedOperationException("Utility class");
    }

    public static double predict(List<Double> x, List<Double> y, double nextX) {
        if (x == null || y == null || x.size() != y.size() || x.size() < 2) {
            return -1; // Not enough data or mismatch
        }

        int n = x.size();
        double sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;

        for (int i = 0; i < n; i++) {
            Double valX = x.get(i);
            Double valY = y.get(i);
            if (valX == null || valY == null) continue;

            sumX += valX;
            sumY += valY;
            sumXY += valX * valY;
            sumX2 += valX * valX;
        }

        double denominator = (n * sumX2 - sumX * sumX);
        if (denominator == 0) {
            return y.isEmpty() ? -1 : y.get(y.size() - 1); // Fallback
        }

        double slope = (n * sumXY - sumX * sumY) / denominator;
        double intercept = (sumY - slope * sumX) / n;

        return intercept + slope * nextX;
    }
}
