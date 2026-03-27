# Digital Twin of Student

A full-stack AI-powered web application that simulates a student's digital twin to track behavior, predict academic performance, and provide personalized recommendations.

## Tech Stack
- **Frontend**: React, Tailwind CSS, Recharts, Lucide React
- **Backend**: Spring Boot 3, Spring Security, JWT, JPA
- **Database**: MySQL 8.0

## Features
- **JWT Authentication**: Secure login and registration for students.
- **Data Collection**: Track subject-wise marks, study hours, sleep, attendance, and focus levels.
- **AI Twin Engine**: Predicts future academic scores based on behavioral patterns.
- **Risk Assessment**: Classifies students into Low, Medium, and High-risk categories.
- **Intelligent Recommendations**: Automatic suggestions to improve academic status.
- **Interactive Dashboard**: Visualizes trends and proficiency using modern charts.

## Prerequisites
- Java 21+
- Maven 3.9+
- MySQL 8.0+
- Node.js 18+

## Getting Started

### 1. Database Setup
Create a database named `digital_twin_db` in your MySQL server.

### 2. Backend Setup
1. Navigate to the `backend` folder.
2. Update `src/main/resources/application.properties` with your MySQL credentials (if different from koushik/123456).
3. Run the application:
   ```bash
   mvn spring-boot:run
   ```

### 3. Frontend Setup
1. Navigate to the `frontend` folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser at `http://localhost:5173`.

## Digital Twin Engine (Machine Learning)
The prediction engine uses a **Simple Linear Regression** model implemented in Java. It predicts the expected base marks by analyzing the historical relationship between `study_hours` and `performance_marks`.

The final prediction combines:
1. **Regression Base** (60% weight): Trend-based projection.
2. **Current Attendance** (30% weight): Latest recorded attendance.
3. **Current Effort** (10% weight): Latest study hours.

## Troubleshooting (IDE Problems)
If you see a lot of "Cannot resolve symbol" or "Missing JDK" errors in your IDE (like VS Code):
1. **Unbound JRE**: Ensure you have a **JDK 21 or 25** correctly configured as the project SDK in your IDE settings.
2. **Reload Project**: Right-click on `pom.xml` and select "Add as Maven Project" or "Reload Project".
3. **Tailwind Rules**: If CSS rules like `@tailwind` show warnings, install the "Tailwind CSS IntelliSense" extension in VS Code.

