package com.employee_storage.controller;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.employee_storage.model.Employee;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/api")
public class EmployeeController {

    // Your specific file path
    private static final String JSON_FILE_PATH = "E:\\ojt-assignment-1\\database\\employees.json";
    
    private final ObjectMapper objectMapper = new ObjectMapper();

    @GetMapping("/get-all-employees")
    public ResponseEntity<?> getAllEmployees() {
        try {
            File jsonFile = new File(JSON_FILE_PATH);
            
            // Check if file exists
            if (!jsonFile.exists()) {
                return ResponseEntity.status(404).body(
                    Map.of("error", "File not found", "path", JSON_FILE_PATH)
                );
            }
            
            // Read and parse the JSON file into List of Employee objects
            List<Employee> employees = objectMapper.readValue(
                jsonFile, 
                new TypeReference<List<Employee>>() {}
            );
            
            // Return the list of employees
            return ResponseEntity.ok(employees);
            
        } catch (IOException e) {
            return ResponseEntity.status(500).body(
                Map.of("error", "Failed to read file", "message", e.getMessage())
            );
        }
    }
    
    @PostMapping("/add-employee")
    public ResponseEntity<?> addEmployee(@RequestBody Employee newEmployee) {
        try {
            File jsonFile = new File(JSON_FILE_PATH);
            
            // Check if file exists, create empty array if it doesn't
            if (!jsonFile.exists()) {
                jsonFile.getParentFile().mkdirs();
                objectMapper.writeValue(jsonFile, new ArrayList<Employee>());
            }
            
            // Read existing employees
            List<Employee> employees = objectMapper.readValue(
                jsonFile, 
                new TypeReference<List<Employee>>() {}
            );
            
            // UUID is already generated in Employee constructor!
            // So newEmployee already has a UUID id
            
            // Add new employee to the list
            employees.add(newEmployee);
            
            // Write updated list back to file
            objectMapper.writeValue(jsonFile, employees);
            
            // Return success response
            return ResponseEntity.status(201).body(
                Map.of(
                    "message", "Employee added successfully",
                    "employee", newEmployee,
                    "totalEmployees", employees.size()
                )
            );
            
        } catch (IOException e) {
            return ResponseEntity.status(500).body(
                Map.of("error", "Failed to add employee", "message", e.getMessage())
            );
        }
    }
    
    @PutMapping("/update-employee/{id}")
    public ResponseEntity<?> updateEmployee(@PathVariable String id, @RequestBody Employee updatedEmployee) {
        try {
            File jsonFile = new File(JSON_FILE_PATH);
            
            // Check if file exists
            if (!jsonFile.exists()) {
                return ResponseEntity.status(404).body(
                    Map.of("error", "File not found", "path", JSON_FILE_PATH)
                );
            }
            
            // Read existing employees
            List<Employee> employees = objectMapper.readValue(
                jsonFile, 
                new TypeReference<List<Employee>>() {}
            );
            
            // Convert string ID to UUID
            UUID targetId;
            try {
                targetId = UUID.fromString(id);
            } catch (IllegalArgumentException e) {
                return ResponseEntity.status(400).body(
                    Map.of(
                        "error", "Invalid ID format",
                        "message", "ID must be a valid UUID",
                        "providedId", id
                    )
                );
            }
            
            // Find the employee to update
            Optional<Employee> existingEmployeeOpt = employees.stream()
                .filter(emp -> emp.getId().equals(targetId))
                .findFirst();
            
            // If employee not found
            if (existingEmployeeOpt.isEmpty()) {
                return ResponseEntity.status(404).body(
                    Map.of(
                        "error", "Employee not found",
                        "message", "No employee found with ID: " + id,
                        "providedId", id
                    )
                );
            }
            
            Employee existingEmployee = existingEmployeeOpt.get();
            
            // Simply overwrite all fields with the new values
            existingEmployee.setName(updatedEmployee.getName());
            existingEmployee.setEmail(updatedEmployee.getEmail());
            existingEmployee.setDepartment(updatedEmployee.getDepartment());
            existingEmployee.setSalary(updatedEmployee.getSalary());
            existingEmployee.setAge(updatedEmployee.getAge());
            
            // Write updated list back to file
            objectMapper.writeValue(jsonFile, employees);
            
            // Return success response
            return ResponseEntity.ok(
                Map.of(
                    "message", "Employee updated successfully",
                    "employee", existingEmployee,
                    "totalEmployees", employees.size()
                )
            );
            
        } catch (IOException e) {
            return ResponseEntity.status(500).body(
                Map.of("error", "Failed to update employee", "message", e.getMessage())
            );
        }
    }
    
    @DeleteMapping("/delete-employee/{id}")
    public ResponseEntity<?> deleteEmployee(@PathVariable String id) {
        try {
            File jsonFile = new File(JSON_FILE_PATH);
            
            if (!jsonFile.exists()) {
                return ResponseEntity.status(404).body(
                    Map.of("error", "File not found", "path", JSON_FILE_PATH)
                );
            }
            
            // Read existing employees
            List<Employee> employees = objectMapper.readValue(
                jsonFile, 
                new TypeReference<List<Employee>>() {}
            );
            
            // Convert string ID to UUID
            UUID targetId;
            try {
                targetId = UUID.fromString(id);
            } catch (IllegalArgumentException e) {
                return ResponseEntity.status(400).body(
                    Map.of(
                        "error", "Invalid ID format",
                        "message", "ID must be a valid UUID",
                        "providedId", id
                    )
                );
            }
            
            // Find employee to delete
            Optional<Employee> employeeToDelete = employees.stream()
                .filter(emp -> emp.getId().equals(targetId))
                .findFirst();
            
            if (employeeToDelete.isEmpty()) {
                return ResponseEntity.status(404).body(
                    Map.of(
                        "error", "Employee not found",
                        "message", "No employee found with ID: " + id
                    )
                );
            }
            
            // Remove the employee
            employees.removeIf(emp -> emp.getId().equals(targetId));
            
            // Write updated list back to file
            objectMapper.writeValue(jsonFile, employees);
            
            return ResponseEntity.ok(
                Map.of(
                    "message", "Employee deleted successfully",
                    "deletedEmployee", employeeToDelete.get(),
                    "remainingEmployees", employees.size()
                )
            );
            
        } catch (IOException e) {
            return ResponseEntity.status(500).body(
                Map.of("error", "Failed to delete employee", "message", e.getMessage())
            );
        }
    }
}