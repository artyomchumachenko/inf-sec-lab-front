// App.js
import React, { useState, useEffect } from 'react';
import { Container, Typography } from '@mui/material';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from 'react-router-dom';
// import ModeSelector from './alternative/ModeSelector';
// import EncryptionForm from './alternative/EncryptionForm';
// import RSAControls from './alternative/RSAControls';
// import Login from './alternative/Login';
// import Register from './alternative/Register';
// import EncryptionHistory from './alternative/EncryptionHistory';
// import Account from './components/Account';
// import NavBar from './alternative/NavBar';

import ModeSelector from './components/ModeSelector';
import EncryptionForm from './components/EncryptionForm';
import RSAControls from './components/RSAControls';
import Login from './components/Login';
import Register from './components/Register';
import EncryptionHistory from './components/EncryptionHistory';
import Account from './components/Account';
import NavBar from './components/NavBar';

function App() {
    const [encryptionMethod, setEncryptionMethod] = useState('RSA');
    const [inputText, setInputText] = useState('');
    const [outputText, setOutputText] = useState('');
    const [keyStatus, setKeyStatus] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Check for JWT in localStorage to determine if the user is authenticated
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);
    }, []);

    useEffect(() => {
        if (!isAuthenticated) {
            // Пользователь вышел из системы, сбрасываем текстовые поля
            setInputText('');
            setOutputText('');
            // Сбрасываем другие состояния, если необходимо
            setKeyStatus('');
            setEncryptionMethod('RSA');
        }
    }, [isAuthenticated]);

    return (
            <Router>
                <NavBar isAuthenticated={isAuthenticated} />
                <Container maxWidth="md" style={{ marginTop: '2rem' }}>
                    <Routes>
                        <Route
                                path="/"
                                element={
                                    isAuthenticated ? (
                                            <>
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
                                                        <RSAControls
                                                                keyStatus={keyStatus}
                                                                setKeyStatus={setKeyStatus}
                                                        />
                                                )}
                                            </>
                                    ) : (
                                            <Navigate to="/login" replace />
                                    )
                                }
                        />
                        <Route
                                path="/login"
                                element={<Login setIsAuthenticated={setIsAuthenticated} />}
                        />
                        <Route path="/register" element={<Register />} />
                        <Route
                                path="/history"
                                element={
                                    isAuthenticated ? (
                                            <EncryptionHistory />
                                    ) : (
                                            <Navigate to="/login" replace />
                                    )
                                }
                        />
                        <Route
                                path="/account"
                                element={
                                    isAuthenticated ? (
                                            <Account setIsAuthenticated={setIsAuthenticated} />
                                    ) : (
                                            <Navigate to="/login" replace />
                                    )
                                }
                        />
                    </Routes>
                </Container>
            </Router>
    );
}

export default App;
