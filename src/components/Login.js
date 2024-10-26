// components/Login.js
import React, { useState } from 'react';
import {
    TextField,
    Button,
    Typography,
    Container,
    Link as MuiLink,
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';

function Login({ setIsAuthenticated }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            // Отправляем POST-запрос на localhost:8080/user/login
            const response = await fetch('http://localhost:8080/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }), // Передаем логин и пароль в теле запроса
            });

            if (response.ok) {
                // Если запрос успешен, получаем токен
                const token = await response.text(); // Предполагается, что токен возвращается как текст
                localStorage.setItem('token', token); // Сохраняем токен в localStorage
                setIsAuthenticated(true); // Обновляем состояние аутентификации
                navigate('/'); // Перенаправляем пользователя на главную страницу
            } else {
                // Обработка ошибки, если логин неуспешен
                alert('Неверные учетные данные');
            }
        } catch (error) {
            console.error('Ошибка при входе:', error);
            alert('Произошла ошибка при попытке входа. Пожалуйста, попробуйте снова.');
        }
    };

    return (
            <Container maxWidth="sm" style={{ marginTop: '2rem' }}>
                <Typography variant="h5" align="center" gutterBottom>
                    Вход
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
                <Button variant="contained" color="primary" fullWidth onClick={handleLogin}>
                    Войти
                </Button>
                <Typography variant="body2" align="center" style={{ marginTop: '1rem' }}>
                    Если вы ещё не зарегистрированы, нажмите{' '}
                    <MuiLink component={Link} to="/register">
                        Регистрация
                    </MuiLink>
                </Typography>
            </Container>
    );
}

export default Login;
