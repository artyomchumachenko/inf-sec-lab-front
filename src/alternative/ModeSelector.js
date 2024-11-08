import React from 'react';
import './AltNavBar.css'; // Убедитесь, что ваш CSS импортирован

function ModeSelector({ encryptionMethod, setEncryptionMethod }) {
    return (
            <div className="form-group">
                <label htmlFor="encryptionMethod">Метод шифрования</label>
                <select
                        id="encryptionMethod"
                        value={encryptionMethod}
                        onChange={(e) => setEncryptionMethod(e.target.value)}
                >
                    <option value="RSA">RSA</option>
                    <option value="BLOCK">BLOCK</option>
                    <option value="HASH">HASH</option> {/* Добавили HASH */}
                </select>
            </div>
    );
}

export default ModeSelector;
