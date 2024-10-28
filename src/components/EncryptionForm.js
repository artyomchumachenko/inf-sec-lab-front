// src/components/EncryptionForm.js
import React, {useState} from 'react';
import {Alert, Button, Grid, Snackbar, TextField} from '@mui/material';
import axiosInstance from "./axiosInstance";

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
            <div>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                                label="Input Text"
                                multiline
                                rows={4}
                                fullWidth
                                variant="outlined"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                        />
                    </Grid>

                    {encryptionMethod === 'BLOCK' && (
                            <Grid item xs={12}>
                                <TextField
                                        label="Encryption Key"
                                        fullWidth
                                        variant="outlined"
                                        value={encryptionKey}
                                        onChange={(e) => setEncryptionKey(e.target.value)}
                                />
                                <Grid container spacing={1} style={{ marginTop: '8px' }}>
                                    <Grid item>
                                        <Button
                                                variant="outlined"
                                                onClick={handleLoadLast}
                                        >
                                            Load Last
                                        </Button>
                                    </Grid>
                                    <Grid item>
                                        <Button
                                                variant="outlined"
                                                onClick={handleLoadGOST}
                                        >
                                            Load GOST Key
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                    )}

                    <Grid item xs={12}>
                        <TextField
                                label="Output Text"
                                multiline
                                rows={4}
                                fullWidth
                                variant="outlined"
                                value={outputText}
                                InputProps={{
                                    readOnly: true,
                                }}
                        />
                    </Grid>

                    <Grid item xs={12} container justifyContent="center" spacing={2}>
                        <Grid item>
                            <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleEncrypt}
                                    startIcon={<span role="img" aria-label="lock">🔒</span>}
                            >
                                ENCRYPT
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={handleDecrypt}
                                    startIcon={<span role="img" aria-label="unlock">🔓</span>}
                            >
                                DECRYPT
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

export default EncryptionForm;
