// src/components/EncryptionForm.js
import React, { useState } from 'react';
import {
    Alert,
    Button,
    Snackbar,
    TextField,
    Box,
    Typography,
    Divider,
    Card,
    CardContent,
    CardActions
} from '@mui/material';
import { Lock, LockOpen } from '@mui/icons-material';
import axiosInstance from '../components/axiosInstance';
import './AltNavBar.css';

function EncryptionForm({
    encryptionMethod,
    inputText,
    setInputText,
    outputText,
    setOutputText,
}) {
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [encryptionKey, setEncryptionKey] = useState('');

    const handleEncrypt = async () => {
        if (!inputText) {
            setErrorMessage('Please enter text to encrypt.');
            return;
        }

        setOutputText('Processing...');

        try {
            let response;
            if (encryptionMethod === 'RSA') {
                response = await axiosInstance.post('/rsa/encrypt', {
                    text: inputText,
                });
            } else if (encryptionMethod === 'BLOCK') {
                response = await axiosInstance.post('/block/encrypt', {
                    text: inputText,
                    mode: '128',
                    key: encryptionKey,
                });
            }
            setOutputText(response.data.text);
            setSuccessMessage('Encryption successful!');
        } catch (error) {
            console.error(error);
            setErrorMessage(
                    error.response && error.response.data
                            ? error.response.data
                            : 'Encryption error.'
            );
            setOutputText('');
        }
    };

    const handleDecrypt = async () => {
        if (!inputText) {
            setErrorMessage('Please enter text to decrypt.');
            return;
        }

        setOutputText('Processing...');

        try {
            let response;
            if (encryptionMethod === 'RSA') {
                response = await axiosInstance.post('/rsa/decrypt', {
                    text: inputText,
                });
            } else if (encryptionMethod === 'BLOCK') {
                response = await axiosInstance.post('/block/decrypt', {
                    text: inputText,
                    mode: '128',
                    key: encryptionKey,
                });
            }
            setOutputText(response.data.text.trim());
            setSuccessMessage('Decryption successful!');
        } catch (error) {
            console.error(error);
            setErrorMessage(
                    error.response && error.response.data
                            ? error.response.data
                            : 'Decryption error.'
            );
            setOutputText('');
        }
    };

    const handleLoadLast = async () => {
        try {
            const response = await axiosInstance.get('/block/last-key');
            setEncryptionKey(response.data.text);
            setSuccessMessage('Loaded the last encryption key.');
        } catch (error) {
            console.error(error);
            setErrorMessage('Failed to load the last encryption key.');
        }
    };

    const handleLoadGOST = async () => {
        try {
            const response = await axiosInstance.get('/block/gost-key');
            setEncryptionKey(response.data.text);
            setSuccessMessage('Loaded the GOST encryption key.');
        } catch (error) {
            console.error(error);
            setErrorMessage('Failed to load the GOST encryption key.');
        }
    };

    const handleCloseSnackbar = () => {
        setErrorMessage('');
        setSuccessMessage('');
    };

    return (
            <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    {encryptionMethod} Encryption Tool
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Card variant="outlined" sx={{ mb: 3 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Input Text
                        </Typography>
                        <TextField
                                multiline
                                rows={4}
                                fullWidth
                                variant="outlined"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                        />
                    </CardContent>
                </Card>

                {encryptionMethod === 'BLOCK' && (
                        <Card variant="outlined" sx={{ mb: 3 }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Encryption Key
                                </Typography>
                                <TextField
                                        fullWidth
                                        variant="outlined"
                                        value={encryptionKey}
                                        onChange={(e) => setEncryptionKey(e.target.value)}
                                />
                            </CardContent>
                            <CardActions>
                                <Button onClick={handleLoadLast}>Load Last</Button>
                                <Button onClick={handleLoadGOST}>Load GOST Key</Button>
                            </CardActions>
                        </Card>
                )}

                <Card variant="outlined" sx={{ mb: 3 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Output Text
                        </Typography>
                        <TextField
                                multiline
                                rows={4}
                                fullWidth
                                variant="outlined"
                                value={outputText}
                                InputProps={{
                                    readOnly: true,
                                }}
                        />
                    </CardContent>
                </Card>

                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                    <Button
                            variant="contained"
                            color="primary"
                            onClick={handleEncrypt}
                            startIcon={<Lock />}
                    >
                        ENCRYPT
                    </Button>
                    <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleDecrypt}
                            startIcon={<LockOpen />}
                    >
                        DECRYPT
                    </Button>
                </Box>

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
            </Box>
    );
}

export default EncryptionForm;
