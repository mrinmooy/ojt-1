package com.employee_storage.model;

import java.util.UUID;

public class Employee {
    private UUID id; 
    private String name;
    private String email;
    private String department;
    private double salary;
    private int age;
    
    // Default constructor
    public Employee() {
        this.id = UUID.randomUUID(); // Auto-generate UUID on creation
    }
    
    // Parameterized constructor
    public Employee(String name, String email, String department, double salary, int age) {
        this.id = UUID.randomUUID();
        this.name = name;
        this.email = email;
        this.department = department;
        this.salary = salary;
        this.age = age;
    }
    
    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    
    public double getSalary() { return salary; }
    public void setSalary(double salary) { this.salary = salary; }
    
    public int getAge() { return age; }
    public void setAge(int age) { this.age = age; }
    
    @Override
    public String toString() {
        return "Employee{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", department='" + department + '\'' +
                ", salary=" + salary +
                ", age=" + age +
                '}';
    }
}