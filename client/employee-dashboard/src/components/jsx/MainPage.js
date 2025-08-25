import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import {
    Container,
    Paper,
    Typography,
    Button,
    Box,
    CircularProgress,
    Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import EmployeeCard from './EmployeeCard';

function MainPage({ toggleMode, mode }) {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();

    // Function to fetch employees from API
    const fetchEmployees = async () => {
        try {
            setLoading(true);
            setError(null);

            // Explicit GET request
            const response = await fetch('http://localhost:8080/api/get-all-employees', {
                method: 'GET', // This is optional (GET is default)
                headers: {
                    'Accept': 'application/json', // Explicitly ask for JSON
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setEmployees(data);
        } catch (err) {
            setError(err.message);
            console.error('Failed to fetch employees:', err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch data on component mount
    useEffect(() => {
        fetchEmployees();
    }, [location.key]);

    return (
        <Container component="main" maxWidth="md">
            <Box sx={{ mt: 4, mb: 4 }}>
                {/* Title + Dark/Light Toggle */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h3" component="h1" gutterBottom>
                        Employee Directory
                    </Typography>

                    {/* Dark/Light Toggle Button */}
                    <IconButton onClick={toggleMode} color="inherit">
                        {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
                    </IconButton>
                </Box>

                {/* Error Message */}
                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        Error loading employees: {error}
                        <Button onClick={fetchEmployees} sx={{ ml: 2 }} size="small">
                            Retry
                        </Button>
                    </Alert>
                )}

                {/* Loading State */}
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        {/* Main Scrollable Card */}
                        <Paper
                            elevation={3}
                            sx={{
                                p: 3,
                                maxHeight: '60vh',
                                overflow: 'auto',
                                mb: 3
                            }}
                        >
                            <Typography variant="h5" component="h2" gutterBottom>
                                Employees ({employees.length})
                            </Typography>

                            {/* Map through API data to create Employee Cards */}
                            {employees.length > 0 ? (
                                employees.map((employee) => (
                                    <EmployeeCard
                                        key={employee.id}
                                        employee={employee}
                                        onEmployeeDeleted={fetchEmployees}
                                    />
                                ))
                            ) : (
                                <Typography variant="body1" color="text.secondary" align="center" py={4}>
                                    No employees found.
                                </Typography>
                            )}
                        </Paper>
                    </>
                )}

                {/* Add New Employee Button */}
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Button
                        variant="contained"
                        component={Link}
                        to="/add"
                        startIcon={<AddIcon />}
                        size="large"
                    >
                        Add New Employee
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}

export default MainPage;