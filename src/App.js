// src/App.js
import React, { useState } from 'react';
import { Container, Typography } from '@mui/material';
import ModeSelector from './components/ModeSelector';
import EncryptionForm from './components/EncryptionForm';
import RSAControls from './components/RSAControls';

function App() {
    const [encryptionMethod, setEncryptionMethod] = useState('RSA');
    const [inputText, setInputText] = useState('');
    const [outputText, setOutputText] = useState('');
    const [keyStatus, setKeyStatus] = useState('');

    return (
            <Container maxWidth="md" style={{ marginTop: '2rem' }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Encryption Tool
                </Typography>
                <ModeSelector
                        encryptionMethod={encryptionMethod}
                        setEncryptionMethod={setEncryptionMethod}
                />

                <EncryptionForm
                        encryptionMethod={encryptionMethod}
                        inputText={inputText}
                        setInputText={setInputText}
                        outputText={outputText}
                        setOutputText={setOutputText}
                />

                {encryptionMethod === 'RSA' && (
                        <RSAControls keyStatus={keyStatus} setKeyStatus={setKeyStatus} />
                )}
            </Container>
    );
}

export default App;
