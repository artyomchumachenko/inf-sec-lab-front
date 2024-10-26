// components/NavBar.js
import React from 'react';
import { AppBar, Toolbar, Button } from '@mui/material';
import { Link } from 'react-router-dom';

function NavBar({ isAuthenticated }) {
    return (
            <AppBar position="static">
                <Toolbar style={{ justifyContent: 'center' }}>
                    <Button color="inherit" component={Link} to="/">
                        Главная
                    </Button>
                    <Button color="inherit" component={Link} to="/history">
                        История шифрований
                    </Button>
                    {isAuthenticated ? (
                            <Button color="inherit" component={Link} to="/account">
                                Личный кабинет
                            </Button>
                    ) : (
                            <>
                                <Button color="inherit" component={Link} to="/login">
                                    Вход
                                </Button>
                                <Button color="inherit" component={Link} to="/register">
                                    Регистрация
                                </Button>
                            </>
                    )}
                </Toolbar>
            </AppBar>
    );
}

export default NavBar;
