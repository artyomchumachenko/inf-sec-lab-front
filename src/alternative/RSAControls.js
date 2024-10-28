// src/components/RSAControls.js
import React, { useState } from 'react';
import axiosInstance from '../components/axiosInstance';
import './AltRegister.css'; // Убедитесь, что ваш CSS импортирован

function RSAControls({ keyStatus, setKeyStatus }) {
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [confirmOpen, setConfirmOpen] = useState(false);

    const handleGenerateKeys = async () => {
        try {
            const response = await axiosInstance.get('/rsa/keys-generate');
            setKeyStatus(response.data);
            setSuccessMessage('Генерация ключей начата.');
            setErrorMessage('');
        } catch (error) {
            console.error(error);
            setErrorMessage(
                    error.response && error.response.data
                            ? error.response.data
                            : 'Ошибка при генерации ключей.'
            );
            setSuccessMessage('');
        }
    };

    const handleCheckKeysStatus = async () => {
        try {
            const response = await axiosInstance.get('/rsa/keys-status');
            setKeyStatus(response.data);
            setSuccessMessage('Статус ключей получен.');
            setErrorMessage('');
        } catch (error) {
            console.error(error);
            setErrorMessage(
                    error.response && error.response.data
                            ? error.response.data
                            : 'Ошибка при проверке статуса ключей.'
            );
            setSuccessMessage('');
        }
    };

    const handleDeleteKeys = async () => {
        try {
            await axiosInstance.delete('/rsa/keys-delete');
            setKeyStatus('Ключи удалены.');
            setSuccessMessage('RSA ключи удалены.');
            setErrorMessage('');
        } catch (error) {
            console.error(error);
            setErrorMessage(
                    error.response && error.response.data
                            ? error.response.data
                            : 'Ошибка при удалении ключей.'
            );
            setSuccessMessage('');
        } finally {
            setConfirmOpen(false); // Закрываем диалог подтверждения
        }
    };

    const handleOpenConfirm = () => {
        setConfirmOpen(true);
    };

    const handleCloseConfirm = () => {
        setConfirmOpen(false);
    };

    const handleCloseNotification = () => {
        setErrorMessage('');
        setSuccessMessage('');
    };

    return (
            <div className="rsa-controls">
                {errorMessage && (
                        <div className="notification error">
                            <span>{errorMessage}</span>
                            <button className="close-btn" onClick={handleCloseNotification}>
                                &times;
                            </button>
                        </div>
                )}

                {successMessage && (
                        <div className="notification success">
                            <span>{successMessage}</span>
                            <button className="close-btn" onClick={handleCloseNotification}>
                                &times;
                            </button>
                        </div>
                )}

                <div className="form-group">
                    <label htmlFor="keyStatus">Статус ключей</label>
                    <textarea
                            id="keyStatus"
                            rows="2"
                            value={keyStatus}
                            readOnly
                            placeholder="Статус ключей будет отображен здесь..."
                    ></textarea>
                </div>

                <div className="button-group">
                    <button className="btn secondary-btn" onClick={handleGenerateKeys}>
                        Генерация ключей
                    </button>
                    <button className="btn secondary-btn" onClick={handleCheckKeysStatus}>
                        Проверить статус ключей
                    </button>
                    <button className="btn danger-btn" onClick={handleOpenConfirm}>
                        Удалить ключи
                    </button>
                </div>

                {/* Диалог подтверждения */}
                {confirmOpen && (
                        <div className="dialog-overlay">
                            <div className="dialog">
                                <h3>Удаление RSA ключей</h3>
                                <p>Вы уверены, что хотите удалить RSA ключи?</p>
                                <div className="dialog-actions">
                                    <button className="btn" onClick={handleCloseConfirm}>
                                        Отмена
                                    </button>
                                    <button className="btn danger-btn" onClick={handleDeleteKeys}>
                                        Удалить
                                    </button>
                                </div>
                            </div>
                        </div>
                )}
            </div>
    );
}

export default RSAControls;
