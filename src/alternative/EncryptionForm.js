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
    CardActions,
    Grid,
    TextareaAutosize
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
    const [hashInput, setHashInput] = useState('');
    const [encodeUsername, setEncodeUsername] = useState('');
    const [encodePassword, setEncodePassword] = useState('');
    const [hashOutput, setHashOutput] = useState('');
    const [encodeOutput, setEncodeOutput] = useState('');

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

    // Новые обработчики для метода HASH
    const handleHash = async () => {
        if (!hashInput) {
            setErrorMessage('Please enter text to hash.');
            return;
        }

        setHashOutput('Processing...');

        try {
            const response = await axiosInstance.post('/user/hash', {
                input: hashInput,
            });
            setHashOutput(response.data);
            setSuccessMessage('Hashing successful!');
        } catch (error) {
            console.error(error);
            setErrorMessage('Hashing error.');
            setHashOutput('');
        }
    };

    const handleEncode = async () => {
        if (!encodeUsername || !encodePassword) {
            setErrorMessage('Please enter username and password.');
            return;
        }

        setEncodeOutput('Processing...');

        try {
            const response = await axiosInstance.post('/user/encode', {
                username: encodeUsername,
                password: encodePassword,
            });
            setEncodeOutput(response.data);
            setSuccessMessage('Encoding successful!');
        } catch (error) {
            console.error(error);
            setErrorMessage('Encoding error.');
            setEncodeOutput('');
        }
    };

    const handleCloseSnackbar = () => {
        setErrorMessage('');
        setSuccessMessage('');
    };

    return (
            <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    {encryptionMethod}
                </Typography>
                <Divider sx={{ mb: 3 }} />

                {encryptionMethod !== 'HASH' && (
                        <>
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
                        </>
                )}

                {encryptionMethod === 'HASH' && (
                        <>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Card variant="outlined">
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom>
                                                Stribog 512
                                            </Typography>
                                            <TextField
                                                    fullWidth
                                                    variant="outlined"
                                                    value={hashInput}
                                                    onChange={(e) => setHashInput(e.target.value)}
                                                    label="Text to Hash"
                                            />
                                        </CardContent>
                                        <CardActions>
                                            <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={handleHash}
                                            >
                                                Get Hash
                                            </Button>
                                        </CardActions>
                                        {hashOutput && (
                                                <CardContent>
                                                    <Typography variant="h6" gutterBottom>
                                                        Hash Output
                                                    </Typography>
                                                    <TextareaAutosize
                                                            value={hashOutput}
                                                            readOnly
                                                            style={{
                                                                width: '100%',
                                                                fontSize: '1rem',
                                                                padding: '8px',
                                                                boxSizing: 'border-box',
                                                                wordBreak: 'break-all',
                                                                overflowWrap: 'break-word',
                                                                borderRadius: '4px',
                                                                borderColor: '#c4c4c4',
                                                                borderWidth: '1px',
                                                                borderStyle: 'solid',
                                                            }}
                                                    />
                                                </CardContent>
                                        )}
                                    </Card>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Card variant="outlined">
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom>
                                                Hash + Salt
                                            </Typography>
                                            <TextField
                                                    fullWidth
                                                    variant="outlined"
                                                    value={encodeUsername}
                                                    onChange={(e) => setEncodeUsername(e.target.value)}
                                                    label="Username"
                                                    sx={{ mb: 2 }}
                                            />
                                            <TextField
                                                    fullWidth
                                                    variant="outlined"
                                                    value={encodePassword}
                                                    onChange={(e) => setEncodePassword(e.target.value)}
                                                    label="Password"
                                                    type="password"
                                            />
                                        </CardContent>
                                        <CardActions>
                                            <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={handleEncode}
                                            >
                                                Encode Password
                                            </Button>
                                        </CardActions>
                                        {encodeOutput && (
                                                <CardContent>
                                                    <Typography variant="h6" gutterBottom>
                                                        Encoded Output
                                                    </Typography>
                                                    <TextareaAutosize
                                                            value={encodeOutput}
                                                            readOnly
                                                            style={{
                                                                width: '100%',
                                                                fontSize: '1rem',
                                                                padding: '8px',
                                                                boxSizing: 'border-box',
                                                                wordBreak: 'break-all',
                                                                overflowWrap: 'break-word',
                                                                borderRadius: '4px',
                                                                borderColor: '#c4c4c4',
                                                                borderWidth: '1px',
                                                                borderStyle: 'solid',
                                                            }}
                                                    />
                                                </CardContent>
                                        )}
                                    </Card>
                                </Grid>
                            </Grid>
                        </>
                )}

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
