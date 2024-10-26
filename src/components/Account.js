// components/Account.js
import React from 'react';
import { Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Account({ setIsAuthenticated }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        navigate('/login');
    };

    return (
            <Container maxWidth="sm" style={{ marginTop: '2rem' }}>
                <Typography variant="h5" align="center" gutterBottom>
                    Личный кабинет
                </Typography>
                {/* Display user information here */}
                <Button
                        variant="contained"
                        color="secondary"
                        fullWidth
                        onClick={handleLogout}
                >
                    Выйти
                </Button>
            </Container>
    );
}

export default Account;
