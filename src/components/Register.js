// components/Register.js
import React, { useState } from 'react';
import {
    TextField,
    Button,
    Typography,
    Container,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const navigate = useNavigate();

    const handleRegister = async () => {
        if (password !== confirmPassword) {
            alert('Пароли не совпадают');
            return;
        }

        // Отправляем POST-запрос на localhost:8080/user/registration
        try {
            const response = await fetch('http://localhost:8080/user/registration', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password, email, phone }),
            });

            if (response.ok) {
                alert('Регистрация успешна');
                navigate('/login'); // Перенаправляем пользователя на страницу входа
            } else {
                const errorMessage = await response.text();
                alert(`Ошибка при регистрации: ${errorMessage}`);
            }
        } catch (error) {
            console.error('Ошибка при регистрации:', error);
            alert('Произошла ошибка при попытке регистрации. Пожалуйста, попробуйте снова.');
        }
    };

    return (
            <Container maxWidth="sm" style={{ marginTop: '2rem' }}>
                <Typography variant="h5" align="center" gutterBottom>
                    Регистрация
                </Typography>
                <TextField
                        label="Логин"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                        label="Пароль"
                        variant="outlined"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                />
                <TextField
                        label="Повторите пароль"
                        variant="outlined"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <TextField
                        label="Почта"
                        variant="outlined"
                        type="email"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                        label="Номер телефона"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                />
                <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleRegister}
                >
                    Зарегистрироваться
                </Button>
            </Container>
    );
}

export default Register;
