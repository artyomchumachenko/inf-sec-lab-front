// src/components/Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AltRegister.css'; // Убедитесь, что ваш CSS импортирован

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
            <div className="auth-container">
                <h2>Регистрация</h2>
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
                <div className="form-group">
                    <label htmlFor="confirmPassword">Повторите пароль</label>
                    <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Повторите пароль"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Почта</label>
                    <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Введите адрес электронной почты"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="phone">Номер телефона</label>
                    <input
                            type="tel"
                            id="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Введите номер телефона"
                    />
                </div>
                <button className="btn primary-btn" onClick={handleRegister}>
                    Зарегистрироваться
                </button>
            </div>
    );
}

export default Register;
