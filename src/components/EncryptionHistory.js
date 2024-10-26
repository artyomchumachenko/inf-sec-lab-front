// components/EncryptionHistory.js
import React, {useEffect, useState} from 'react';
import {Container, List, ListItem, ListItemText, Typography} from '@mui/material';
import axiosInstance from "./axiosInstance";

function EncryptionHistory() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Функция для загрузки истории шифрований
        const fetchHistory = async () => {
            try {
                const response = await axiosInstance.get('/history'); // Отправляем GET-запрос на /history
                setHistory(response.data); // Сохраняем данные истории в состояние
                setLoading(false); // Устанавливаем загрузку в false после успешного получения данных
            } catch (error) {
                console.error('Ошибка при загрузке истории шифрований:', error);
                setError('Не удалось загрузить историю шифрований');
                setLoading(false);
            }
        };

        fetchHistory();
    }, []); // Пустой массив зависимостей означает, что запрос будет выполнен только при монтировании

    if (loading) {
        return (
                <Container maxWidth="md" style={{ marginTop: '2rem' }}>
                    <Typography variant="h5" align="center" gutterBottom>
                        Загрузка истории шифрований...
                    </Typography>
                </Container>
        );
    }

    if (error) {
        return (
                <Container maxWidth="md" style={{ marginTop: '2rem' }}>
                    <Typography variant="h5" align="center" color="error" gutterBottom>
                        {error}
                    </Typography>
                </Container>
        );
    }

    return (
            <Container maxWidth="md" style={{ marginTop: '2rem' }}>
                <Typography variant="h5" align="center" gutterBottom>
                    История шифрований
                </Typography>
                <List>
                    {history.map((item, index) => (
                            <ListItem key={index}>
                                <ListItemText primary={item.encryptedText} secondary={item.date} />
                            </ListItem>
                    ))}
                </List>
            </Container>
    );
}

export default EncryptionHistory;
