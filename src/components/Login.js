import React, { useState } from 'react';
import {
    TextField,
    Button,
    Typography,
    Container,
    Link as MuiLink,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
    CircularProgress,
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';

function Login({ setIsAuthenticated }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [otpOpen, setOtpOpen] = useState(false);
    const [qrCodeOpen, setQrCodeOpen] = useState(false);
    const [qrCodeImage, setQrCodeImage] = useState(null);
    const [qrCode, setQrCode] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8080/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                setOtpOpen(true);
            } else {
                alert('Неверные учетные данные');
            }
        } catch (error) {
            console.error('Ошибка при входе:', error);
            alert('Произошла ошибка при попытке входа. Пожалуйста, попробуйте снова.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8080/user/verify-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, otp }),
            });

            if (response.ok) {
                setOtpOpen(false);

                // Запрашиваем QR-код
                const qrResponse = await fetch(`http://localhost:8080/user/generate-qr?username=${encodeURIComponent(username)}`, {
                    method: 'GET',
                });

                if (qrResponse.ok) {
                    const blob = await qrResponse.blob();
                    const url = URL.createObjectURL(blob);
                    setQrCodeImage(url);
                    setQrCodeOpen(true);
                } else {
                    alert('Ошибка при получении QR-кода');
                }
            } else {
                alert('Неверный OTP');
            }
        } catch (error) {
            console.error('Ошибка при проверке OTP:', error);
            alert('Произошла ошибка при проверке OTP. Пожалуйста, попробуйте снова.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyQrCode = async () => {
        setLoading(true);
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
        } finally {
            setLoading(false);
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
                <Button variant="contained" color="primary" fullWidth onClick={handleLogin} disabled={loading}>
                    {loading ? <CircularProgress size={24} /> : 'Войти'}
                </Button>
                <Typography variant="body2" align="center" style={{ marginTop: '1rem' }}>
                    Если вы ещё не зарегистрированы, нажмите{' '}
                    <MuiLink component={Link} to="/register">
                        Регистрация
                    </MuiLink>
                </Typography>

                {/* Модальное окно для ввода OTP */}
                <Dialog open={otpOpen} onClose={() => setOtpOpen(false)}>
                    <DialogTitle>Введите OTP из вашей почты</DialogTitle>
                    <DialogContent>
                        <TextField
                                label="OTP"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleVerifyOtp} color="primary" disabled={loading}>
                            {loading ? <CircularProgress size={24} /> : 'Подтвердить'}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Модальное окно для отображения QR-кода и ввода кода */}
                <Dialog open={qrCodeOpen} onClose={() => setQrCodeOpen(false)}>
                    <DialogTitle>Сканируйте QR-код и введите код</DialogTitle>
                    <DialogContent>
                        {qrCodeImage ? (
                                <img src={qrCodeImage} alt="QR Code" style={{ width: '100%', height: 'auto' }} />
                        ) : (
                                <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                                    <CircularProgress />
                                </Box>
                        )}
                        <TextField
                                label="Код из QR-кода"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                value={qrCode}
                                onChange={(e) => setQrCode(e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleVerifyQrCode} color="primary" disabled={loading}>
                            {loading ? <CircularProgress size={24} /> : 'Подтвердить'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
    );
}

export default Login;
