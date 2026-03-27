package com.digitaltwin.student.model;

import jakarta.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "students")
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;

    public Student() {}

    public Student(String name, String email, String password, Role role) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
    }

    public static StudentBuilder builder() {
        return new StudentBuilder();
    }

    public enum Role {
        STUDENT, ADMIN
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public static class StudentBuilder {
        private String name;
        private String email;
        private String password;
        private Role role;

        public StudentBuilder name(String name) { this.name = name; return this; }
        public StudentBuilder email(String email) { this.email = email; return this; }
        public StudentBuilder password(String password) { this.password = password; return this; }
        public StudentBuilder role(Role role) { this.role = role; return this; }
        public Student build() {
            return new Student(name, email, password, role);
        }
    }
}
