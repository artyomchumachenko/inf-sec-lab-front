// components/EncryptionForm.js
import React, { useState } from 'react';
import axios from 'axios';
import {
    TextField,
    Button,
    Grid,
    Snackbar,
    Alert,
} from '@mui/material';

function EncryptionForm({
    encryptionMethod,
    blockMode,
    inputText,
    setInputText,
    outputText,
    setOutputText,
}) {
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Map blockMode to backend expected values
    const getBlockModeValue = (mode) => {
        if (mode === '64') {
            return 'MODE_64';
        } else if (mode === '128') {
            return 'MODE_128';
        }
        return mode; // Fallback to the original value if unexpected
    };

    const handleEncrypt = async () => {
        if (!inputText) {
            setErrorMessage('Please enter text to encrypt.');
            return;
        }

        try {
            let response;
            if (encryptionMethod === 'RSA') {
                response = await axios.post('http://localhost:8080/rsa/encrypt', {
                    text: inputText,
                });
            } else if (encryptionMethod === 'BLOCK') {
                const modeValue = getBlockModeValue(blockMode);
                response = await axios.post('http://localhost:8080/block/encrypt', {
                    text: inputText,
                    mode: modeValue,
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
        }
    };

    const handleDecrypt = async () => {
        if (!inputText) {
            setErrorMessage('Please enter text to decrypt.');
            return;
        }

        try {
            let response;
            if (encryptionMethod === 'RSA') {
                response = await axios.post('http://localhost:8080/rsa/decrypt', {
                    text: inputText,
                });
            } else if (encryptionMethod === 'BLOCK') {
                const modeValue = getBlockModeValue(blockMode);
                response = await axios.post('http://localhost:8080/block/decrypt', {
                    text: inputText,
                    mode: modeValue,
                });
            }
            setOutputText(response.data.text);
            setSuccessMessage('Decryption successful!');
        } catch (error) {
            console.error(error);
            setErrorMessage(
                    error.response && error.response.data
                            ? error.response.data
                            : 'Decryption error.'
            );
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
                            <Button variant="contained" color="primary" onClick={handleEncrypt}>
                                ENCRYPT
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button variant="contained" color="secondary" onClick={handleDecrypt}>
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
