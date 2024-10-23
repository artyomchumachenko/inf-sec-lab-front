// index.js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2', // Blue color
        },
        secondary: {
            main: '#dc004e', // Red color
        },
    },
});

ReactDOM.render(
        <ThemeProvider theme={theme}>
            <App />
        </ThemeProvider>,
        document.getElementById('root')
);
