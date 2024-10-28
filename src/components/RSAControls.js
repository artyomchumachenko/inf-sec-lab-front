// components/RSAControls.js
import React, {useState} from 'react';
import {
    Alert, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Snackbar, TextField,
} from '@mui/material';
import axiosInstance from './axiosInstance';

function RSAControls({ keyStatus, setKeyStatus }) {
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [confirmOpen, setConfirmOpen] = useState(false);

    const handleGenerateKeys = async () => {
        try {
            const response = await axiosInstance.get('/rsa/keys-generate');
            setKeyStatus(response.data);
            setSuccessMessage('Key generation started.');
        } catch (error) {
            console.error(error);
            setErrorMessage(
                    error.response && error.response.data
                            ? error.response.data
                            : 'Error generating keys.'
            );
        }
    };

    const handleCheckKeysStatus = async () => {
        try {
            const response = await axiosInstance.get('/rsa/keys-status');
            setKeyStatus(response.data);
            setSuccessMessage('Key status retrieved.');
        } catch (error) {
            console.error(error);
            setErrorMessage(
                    error.response && error.response.data
                            ? error.response.data
                            : 'Error checking keys status.'
            );
        }
    };

    const handleDeleteKeys = async () => {
        try {
            await axiosInstance.delete('/rsa/keys-delete');
            setKeyStatus('Keys deleted.');
            setSuccessMessage('RSA KeyPair has been deleted.');
        } catch (error) {
            console.error(error);
            setErrorMessage(
                    error.response && error.response.data
                            ? error.response.data
                            : 'Error deleting keys.'
            );
        } finally {
            setConfirmOpen(false); // Close the confirmation dialog
        }
    };

    const handleOpenConfirm = () => {
        setConfirmOpen(true);
    };

    const handleCloseConfirm = () => {
        setConfirmOpen(false);
    };

    const handleCloseSnackbar = () => {
        setErrorMessage('');
        setSuccessMessage('');
    };

    return (
            <div style={{ marginTop: '2rem' }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                                label="Key Status"
                                multiline
                                rows={2}
                                fullWidth
                                variant="outlined"
                                value={keyStatus}
                                InputProps={{
                                    readOnly: true,
                                }}
                        />
                    </Grid>
                    <Grid item xs={12} container justifyContent="center" spacing={2}>
                        <Grid item>
                            <Button variant="outlined" color="primary" onClick={handleGenerateKeys}>
                                KEYS GENERATE
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button variant="outlined" color="primary" onClick={handleCheckKeysStatus}>
                                KEYS STATUS
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button variant="outlined" color="secondary" onClick={handleOpenConfirm}>
                                DELETE KEYS
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>

                {/* Confirmation Dialog */}
                <Dialog
                        open={confirmOpen}
                        onClose={handleCloseConfirm}
                        aria-labelledby="confirm-dialog-title"
                        aria-describedby="confirm-dialog-description"
                >
                    <DialogTitle id="confirm-dialog-title">Delete RSA KeyPair</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="confirm-dialog-description">
                            Are you sure you want to delete RSA KeyPair?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseConfirm} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleDeleteKeys} color="secondary" autoFocus>
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>

                <Snackbar
                        open={!!errorMessage || !!successMessage}
                        autoHideDuration={6000}
                        onClose={handleCloseSnackbar}
                >
                    {errorMessage ? (
                            <Alert
                                    onClose={handleCloseSnackbar}
                                    severity="error"
                                    sx={{ width: '100%' }}
                            >
                                {errorMessage}
                            </Alert>
                    ) : (
                            <Alert
                                    onClose={handleCloseSnackbar}
                                    severity="success"
                                    sx={{ width: '100%' }}
                            >
                                {successMessage}
                            </Alert>
                    )}
                </Snackbar>
            </div>
    );
}

export default RSAControls;
