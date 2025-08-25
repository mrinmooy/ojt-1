import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import {
    Box,
    Paper,
    Button,
    TextField,
    Typography,
    Container,
    Dialog,
    DialogContent,
    DialogActions,
    DialogTitle
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function FormPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [successDialogOpen, setSuccessDialogOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errors, setErrors] = useState({});

    // Check if we're in edit mode
    const isEditing = location.state?.isEditing || false;
    const employeeToEdit = location.state?.employee || null;

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        department: '',
        salary: '',
        age: ''
    });

    // Pre-fill form if in edit mode
    useEffect(() => {
        if (isEditing && employeeToEdit) {
            setFormData({
                name: employeeToEdit.name,
                email: employeeToEdit.email,
                department: employeeToEdit.department,
                salary: employeeToEdit.salary.toString(),
                age: employeeToEdit.age.toString()
            });
        }
    }, [isEditing, employeeToEdit]);

    // Validation function
    const validateField = (name, value) => {
        let error = "";

        switch (name) {
            case "name":
                if (!value.trim()) error = "Name is required";
                else if (value.length > 50) error = "Name cannot exceed 50 characters";
                break;
            case "email":
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!value.trim()) error = "Email is required";
                else if (!emailRegex.test(value)) error = "Invalid email format";
                break;
            case "department":
                if (!value.trim()) error = "Department is required";
                else if (value.length > 30) error = "Department cannot exceed 30 characters";
                break;
            case "salary":
                if (value === "") error = "Salary is required";
                else if (!/^\d*\.?\d*$/.test(value)) error = "Only numbers allowed";
                else if (parseFloat(value) < 0) error = "Salary cannot be negative";
                break;
            case "age":
                if (value === "") error = "Age is required";
                else if (!/^\d*$/.test(value)) error = "Only numbers allowed";
                else if (parseInt(value) < 18 || parseInt(value) > 100) error = "Age must be between 18 and 100";
                break;
            default:
                break;
        }
        return error;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Apply length restriction
        let newValue = value;
        if (name === "name" && value.length > 50) newValue = value.slice(0, 50);
        if (name === "email" && value.length > 50) newValue = value.slice(0, 50);
        if (name === "department" && value.length > 30) newValue = value.slice(0, 30);

        // Validate field
        const error = validateField(name, newValue);

        setFormData((prev) => ({ ...prev, [name]: newValue }));
        setErrors((prev) => ({ ...prev, [name]: error }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // validate all fields before submit
        let hasError = false;
        let newErrors = {};
        for (const key in formData) {
            const err = validateField(key, formData[key]);
            if (err) {
                newErrors[key] = err;
                hasError = true;
            }
        }
        setErrors(newErrors);
        if (hasError) {
            setLoading(false);
            return;
        }

        try {
            const payload = {
                ...formData,
                salary: parseFloat(formData.salary),
                age: parseInt(formData.age)
            };

            let url, method;
            if (isEditing) {
                url = `http://localhost:8080/api/update-employee/${employeeToEdit.id}`;
                method = 'PUT';
            } else {
                url = 'http://localhost:8080/api/add-employee';
                method = 'POST';
            }

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            // ✅ Success → Show popup
            setSuccessMessage(isEditing ? "Employee updated successfully!" : "Employee added successfully!");
            setSuccessDialogOpen(true);

        } catch (err) {
            setSuccessMessage("Failed to save employee: " + err.message);
            setSuccessDialogOpen(true);
        } finally {
            setLoading(false);
        }
    };

    const handleDialogClose = () => {
        setSuccessDialogOpen(false);
        if (!successMessage.startsWith("Failed")) {
            navigate('/', { state: { refresh: true } }); // only navigate if success
        }
    };

    return (
        <>
            <Container component="main" maxWidth="sm">
                <Box sx={{ mt: 4, mb: 4 }}>
                    <Paper elevation={3} sx={{ p: 4 }}>
                        <Button
                            startIcon={<ArrowBackIcon />}
                            onClick={() => navigate('/')}
                            sx={{ mb: 3 }}
                            disabled={loading}
                        >
                            Back
                        </Button>

                        <Typography component="h1" variant="h4" gutterBottom>
                            {isEditing ? 'Edit Employee' : 'Add New Employee'}
                        </Typography>

                        <form onSubmit={handleSubmit}>
                            <TextField
                                label="Full Name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                fullWidth
                                margin="normal"
                                disabled={loading}
                                error={!!errors.name}
                                helperText={errors.name}
                            />

                            <TextField
                                label="Email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                fullWidth
                                margin="normal"
                                disabled={loading}
                                error={!!errors.email}
                                helperText={errors.email}
                            />

                            <TextField
                                label="Department"
                                name="department"
                                value={formData.department}
                                onChange={handleInputChange}
                                required
                                fullWidth
                                margin="normal"
                                disabled={loading}
                                error={!!errors.department}
                                helperText={errors.department}
                            />

                            <TextField
                                label="Salary"
                                name="salary"
                                type="number"
                                value={formData.salary}
                                onChange={handleInputChange}
                                required
                                fullWidth
                                margin="normal"
                                inputProps={{ step: "0.01", min: 0 }}
                                disabled={loading}
                                error={!!errors.salary}
                                helperText={errors.salary}
                                InputLabelProps={{ shrink: true }}
                            />

                            <TextField
                                label="Age"
                                name="age"
                                type="number"
                                value={formData.age}
                                onChange={handleInputChange}
                                required
                                fullWidth
                                margin="normal"
                                inputProps={{ min: 18, max: 100 }}
                                disabled={loading}
                                error={!!errors.age}
                                helperText={errors.age}
                                InputLabelProps={{ shrink: true }}
                            />

                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                sx={{ mt: 3 }}
                                disabled={loading}
                            >
                                {loading ? 'Saving...' : (isEditing ? 'Update Employee' : 'Submit')}
                            </Button>
                        </form>
                    </Paper>
                </Box>
            </Container>

            {/* Popup Dialog */}
            <Dialog open={successDialogOpen} onClose={handleDialogClose}>
                <DialogTitle>{successMessage.startsWith("Failed") ? "Error" : "Success"}</DialogTitle>
                <DialogContent>
                    <Typography>{successMessage}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} autoFocus>
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default FormPage;
