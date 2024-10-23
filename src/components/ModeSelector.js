// components/ModeSelector.js
import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

function ModeSelector({ encryptionMethod, setEncryptionMethod }) {
    return (
            <FormControl fullWidth margin="normal">
                <InputLabel id="encryption-method-label">Encryption Method</InputLabel>
                <Select
                        labelId="encryption-method-label"
                        value={encryptionMethod}
                        label="Encryption Method"
                        onChange={(e) => setEncryptionMethod(e.target.value)}
                >
                    <MenuItem value="RSA">RSA</MenuItem>
                    <MenuItem value="BLOCK">BLOCK</MenuItem>
                </Select>
            </FormControl>
    );
}

export default ModeSelector;
