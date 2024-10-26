// components/RSAControls.js
import React, { useState } from 'react';
import axios from 'axios';
import {
    TextField,
    Button,
    Grid,
    Snackbar,
    Alert,
} from '@mui/material';
import axiosInstance from "./axiosInstance";

function RSAControls({ keyStatus, setKeyStatus }) {
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

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
                    </Grid>
                </Grid>

                <Snackbar
                        open={!!errorMessage || !!successMessage}
                        autoHideDuration={6000}
                        onClose={handleCloseSnackbar}
                >
                    {errorMessage ? (
                            <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
                                {errorMessage}
                            </Alert>
                    ) : (
                            <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                                {successMessage}
                            </Alert>
                    )}
                </Snackbar>
            </div>
    );
}

export default RSAControls;
