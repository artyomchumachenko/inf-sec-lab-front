// src/components/Login.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './AltLogin.css'; // Убедитесь, что ваш CSS импортирован

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
            <div className="auth-container">
                <h2>Вход</h2>
                <div className="form-group">
                    <label htmlFor="username">Логин</label>
                    <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Введите логин"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Пароль</label>
                    <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Введите пароль"
                    />
                </div>
                <button className="btn primary-btn" onClick={handleLogin}>
                    Войти
                </button>
                <p className="redirect-text">
                    Если вы ещё не зарегистрированы, нажмите{' '}
                    <Link to="/register">Регистрация</Link>
                </p>
            </div>
    );
}

export default Login;
