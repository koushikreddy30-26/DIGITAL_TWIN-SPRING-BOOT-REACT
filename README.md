# 🧠 Digital Twin Student Application

An AI-powered, full-stack Academic Tracking System designed to act as a **Digital Twin** for students. It uses Machine Learning (Linear Regression) to predict future academic performance based on study habits, attendance, and past exam scores.

![Dashboard Preview](frontend/src/assets/hero.png)

## ✨ Core Features

1. **🤖 Live ML Predictions**: Dynamically calculates predicting score and risk level using a server-side Weighted Linear Regression model.
2. **📈 Comprehensive Analytics**: Visualizes subject-wise performance (Radar charts), study trends (Area charts), and activity history.
3. **📊 You vs Top Students**: Compares your statistics (marks, study hours, attendance) against simulated platform averages.
4. **🎯 Goal Tracker**: Set an academic target (e.g., 90%) and visualize progress via animated bars.
5. **💬 AI Chatbot**: A unified AI assistant to help you understand your metrics, weak subjects, and areas of improvement (Sleep, Focus, Attendance).
6. **🧾 PDF Export**: Generates a beautiful, downloadable PDF summary report of the student's digital twin data.
7. **🔐 JWT Authentication**: Secure login/register flow using Spring Security and JWT tokens.

---

## 🛠️ Technology Stack

### **Frontend** (React + Vite)
- **Framework:** React 18, Vite
- **Styling:** Tailwind CSS v4 (Glassmorphism, Gradients, Smooth Animations)
- **Charts:** Recharts
- **Icons:** Lucide-React
- **PDF Generation:** jsPDF + html2canvas

### **Backend** (Spring Boot 3)
- **Framework:** Java 17+, Spring Boot 3.4.3
- **Database:** MySQL 8.0
- **Security:** Spring Security + JWT Auth
- **ML Engine:** Custom Java Math/Linear Regression Utility

---

## 🚀 How to Run the Project Locally

Follow these step-by-step instructions to get the application running on your local machine.

### Prerequisites
- **Java 17+** and **Maven** installed
- **Node.js** (v18+) and **npm** installed
- **MySQL Server** installed and running

### Step 1: Database Setup
1. Open your MySQL client (e.g., MySQL Workbench).
2. Create a new database named `digital_twin_db`:
   ```sql
   CREATE DATABASE digital_twin_db;
   ```
3. Update the database credentials in the backend configuration file located at `backend/src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/digital_twin_db
   spring.datasource.username=root
   spring.datasource.password=your_mysql_password
   ```

### Step 2: Running the Backend (Spring Boot)
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Build and run the Spring Boot application using Maven:
   ```bash
   mvn spring-boot:run
   ```
3. The backend API will start on **`http://localhost:8081`**

### Step 3: Running the Frontend (React)
1. Open a **new/separate terminal** and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the required Node dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. The frontend will start automatically. Open your browser and go to **`http://localhost:5173`**

---

## 🧪 Testing the Application

1. **Register a New User**: Go to `http://localhost:5173/register` and create a Student account.
2. **Add Data**: Click the "Add Data" button on the dashboard to log your first Study Activity and Subject Performance.
3. **View Predictions**: Return to the Dashboard or navigate to the Prediction page to see your real-time risk badge and ML score calculation.
4. **Download Report**: Click "Download Report" inside the Dashboard header to generate a PDF of your metrics.

---

## 💡 Machine Learning Details
The **Prediction Engine** uses a weighted **Linear Regression** algorithm implemented entirely in Java. It analyzes:
* `X1`: Average Past Academic Marks (Weight ~60%)
* `X2`: Study Hours per Day (Weight ~25%)
* `X3`: Attendance Percentage (Weight ~15%)

The model projects these vectors into a final percentage score and assigns an automated Risk Level (`LOW_RISK`, `MEDIUM_RISK`, `HIGH_RISK`).

---

**Developed for the Digital Twin Student Project.**
