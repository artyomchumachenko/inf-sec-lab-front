// src/components/Login.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './AltLogin.css'; // Убедитесь, что ваш CSS импортирован

function Login({ setIsAuthenticated }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
    const [qrCodeImage, setQrCodeImage] = useState(null);
    const [isQrModalOpen, setIsQrModalOpen] = useState(false);
    const [qrCode, setQrCode] = useState('');
    const [isLoginDisabled, setIsLoginDisabled] = useState(false); // Новое состояние
    const navigate = useNavigate();

    const handleLogin = async () => {
        setIsLoginDisabled(true); // Отключаем кнопку сразу после нажатия
        try {
            const response = await fetch('http://localhost:8080/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                // Открываем модальное окно для ввода OTP
                setIsOtpModalOpen(true);
            } else {
                alert('Неверные учетные данные');
                setIsLoginDisabled(false); // Включаем кнопку, если ошибка
            }
        } catch (error) {
            console.error('Ошибка при входе:', error);
            alert('Произошла ошибка при попытке входа. Пожалуйста, попробуйте снова.');
            setIsLoginDisabled(false); // Включаем кнопку, если ошибка
        }
    };

    const handleVerifyOtp = async () => {
        try {
            const response = await fetch('http://localhost:8080/user/verify-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, otp }),
            });

            if (response.ok) {
                setIsOtpModalOpen(false);

                // Запрашиваем QR-код
                const qrResponse = await fetch(`http://localhost:8080/user/generate-qr?username=${encodeURIComponent(username)}`);
                if (qrResponse.ok) {
                    const blob = await qrResponse.blob();
                    const url = URL.createObjectURL(blob);
                    setQrCodeImage(url);
                    setIsQrModalOpen(true);
                } else {
                    alert('Ошибка при получении QR-кода');
                }
            } else {
                alert('Неверный OTP');
            }
        } catch (error) {
            console.error('Ошибка при проверке OTP:', error);
            alert('Произошла ошибка при проверке OTP. Пожалуйста, попробуйте снова.');
        }
    };

    const handleVerifyQrCode = async () => {
        try {
            const response = await fetch('http://localhost:8080/user/verify-qr-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, code: qrCode }),
            });

            if (response.ok) {
                const token = await response.text();
                localStorage.setItem('token', token);
                setIsAuthenticated(true);
                navigate('/');
            } else {
                alert('Неверный код из QR-кода');
            }
        } catch (error) {
            console.error('Ошибка при проверке QR-кода:', error);
            alert('Произошла ошибка при проверке QR-кода. Пожалуйста, попробуйте снова.');
        }
    };

    // Функция для сброса состояния кнопки при изменении полей ввода
    const handleInputChange = (setter) => (e) => {
        setter(e.target.value);
        setIsLoginDisabled(false); // Активируем кнопку при изменении полей
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
                            onChange={handleInputChange(setUsername)}
                            placeholder="Введите логин"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Пароль</label>
                    <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={handleInputChange(setPassword)}
                            placeholder="Введите пароль"
                    />
                </div>
                <button
                        className={`btn primary-btn ${isLoginDisabled ? 'disabled-btn' : ''}`} // Добавляем класс для стилизации
                        onClick={handleLogin}
                        disabled={isLoginDisabled} // Делаем кнопку неактивной при необходимости
                >
                    Войти
                </button>
                <p className="redirect-text">
                    Если вы ещё не зарегистрированы, нажмите{' '}
                    <Link to="/register">Регистрация</Link>
                </p>

                {/* Модальное окно для ввода OTP */}
                {isOtpModalOpen && (
                        <div className="modal-overlay">
                            <div className="modal-content">
                                <h3>Введите OTP из вашей почты</h3>
                                <input
                                        type="text"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        placeholder="Введите OTP"
                                />
                                <button className="btn primary-btn" onClick={handleVerifyOtp}>
                                    Подтвердить
                                </button>
                            </div>
                        </div>
                )}

                {/* Модальное окно для отображения QR-кода и ввода кода */}
                {isQrModalOpen && (
                        <div className="modal-overlay">
                            <div className="modal-content">
                                <h3>Сканируйте QR-код и введите код</h3>
                                {qrCodeImage ? (
                                        <img src={qrCodeImage} alt="QR Code" className="qr-code-image" />
                                ) : (
                                        <p>Загрузка QR-кода...</p>
                                )}
                                <input
                                        type="text"
                                        value={qrCode}
                                        onChange={(e) => setQrCode(e.target.value)}
                                        placeholder="Введите код из QR-кода"
                                />
                                <button className="btn primary-btn" onClick={handleVerifyQrCode}>
                                    Подтвердить
                                </button>
                            </div>
                        </div>
                )}
            </div>
    );
}

export default Login;
