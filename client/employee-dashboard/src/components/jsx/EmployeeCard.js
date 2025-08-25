import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    IconButton,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    CircularProgress,
    Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

function EmployeeCard({ employee, onEmployeeDeleted }) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [resultDialogOpen, setResultDialogOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [deleteResult, setDeleteResult] = useState({ success: false, message: '' });

    const navigate = useNavigate();

    const handleEditClick = () => {
        navigate('/add', {
            state: {
                isEditing: true,
                employee: employee
            }
        });
    };

    const handleDeleteClick = () => {
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        setDeleting(true);
        try {
            const response = await fetch(`http://localhost:8080/api/delete-employee/${employee.id}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            // ✅ Just set success state (do NOT call onEmployeeDeleted here)
            setDeleteResult({
                success: true,
                message: `${employee.name}'s data has been deleted successfully!`
            });

        } catch (err) {
            // ❌ Error case
            setDeleteResult({
                success: false,
                message: `Failed to delete employee: ${err.message}`
            });
            console.error('Failed to delete employee:', err);
        } finally {
            setDeleting(false);
            setDeleteDialogOpen(false);
            setResultDialogOpen(true);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
    };

    const handleResultDialogClose = () => {
        setResultDialogOpen(false);

        // ✅ Only call onEmployeeDeleted AFTER dialog close & success
        if (deleteResult.success && onEmployeeDeleted) {
            onEmployeeDeleted();
        }
    };

    const cellStyle = {
        border: 1,
        borderColor: 'divider',
        wordBreak: "break-word",
        whiteSpace: "normal"
    };

    return (
        <>
            {/* Main Container */}
            <Paper
                elevation={1}
                sx={(theme) => ({
                    mb: 2,
                    p: 2,
                    transition: "0.3s",
                    '&:hover': {
                        boxShadow: 3,
                        backgroundColor:
                            theme.palette.mode === "dark"
                                ? theme.palette.grey[800]
                                : theme.palette.grey[100],
                    },
                    display: 'flex',
                    position: 'relative'
                })}
            >
                {/* Table Container */}
                <Box sx={{ flex: 1, overflow: 'hidden', mr: 2 }}>
                    <TableContainer>
                        <Table
                            size="small"
                            aria-label="employee data table"
                            sx={{ tableLayout: 'fixed', width: '100%' }}
                        >
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={cellStyle}><Typography variant="subtitle2" fontWeight="bold">Name</Typography></TableCell>
                                    <TableCell sx={cellStyle}><Typography variant="subtitle2" fontWeight="bold">Email</Typography></TableCell>
                                    <TableCell sx={cellStyle}><Typography variant="subtitle2" fontWeight="bold">Department</Typography></TableCell>
                                    <TableCell sx={cellStyle}><Typography variant="subtitle2" fontWeight="bold">Salary</Typography></TableCell>
                                    <TableCell sx={cellStyle}><Typography variant="subtitle2" fontWeight="bold">Age</Typography></TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                <TableRow>
                                    <TableCell sx={cellStyle}>{employee.name}</TableCell>
                                    <TableCell sx={cellStyle}>{employee.email}</TableCell>
                                    <TableCell sx={cellStyle}>{employee.department}</TableCell>
                                    <TableCell sx={cellStyle}>
                                        {employee.salary.toLocaleString("en-IN", {
                                            style: "currency",
                                            currency: "INR",
                                        })}
                                    </TableCell>
                                    <TableCell sx={cellStyle}>{employee.age}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>

                {/* Action Buttons */}
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minWidth: '60px',
                    borderLeft: 1,
                    borderColor: 'divider',
                    pl: 1,
                    ml: 1
                }}>
                    <IconButton
                        aria-label="edit"
                        size="small"
                        onClick={handleEditClick}
                        sx={{ mb: 1 }}
                    >
                        <EditIcon sx={{ color: 'green' }} />
                    </IconButton>
                    <IconButton
                        aria-label="delete"
                        size="small"
                        onClick={handleDeleteClick}
                        disabled={deleting}
                    >
                        {deleting ? (
                            <CircularProgress size={20} />
                        ) : (
                            <DeleteIcon sx={{ color: 'red' }} />
                        )}
                    </IconButton>
                </Box>
            </Paper>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete{' '}
                        <Typography component="span" fontWeight="bold" display="inline">
                            {employee.name}
                        </Typography>
                        ? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel} disabled={deleting}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDeleteConfirm}
                        color="error"
                        disabled={deleting}
                        startIcon={deleting ? <CircularProgress size={16} /> : null}
                    >
                        {deleting ? 'Deleting...' : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Result Dialog */}
            <Dialog open={resultDialogOpen} onClose={handleResultDialogClose}>
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {deleteResult.success ? (
                        <>
                            <CheckCircleIcon color="success" />
                            Success
                        </>
                    ) : (
                        <>
                            <ErrorIcon color="error" />
                            Error
                        </>
                    )}
                </DialogTitle>
                <DialogContent>
                    <Alert severity={deleteResult.success ? "success" : "error"} sx={{ mb: 2 }}>
                        {deleteResult.message}
                    </Alert>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleResultDialogClose} variant="contained">
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default EmployeeCard;
