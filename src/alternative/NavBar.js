// src/components/NavBar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './AltNavBar.css';

function NavBar({ isAuthenticated }) {
    return (
            <nav className="navbar">
                <ul className="nav-links">
                    <li>
                        <Link to="/">Главная</Link>
                    </li>
                    <li>
                        <Link to="/history">История шифрований</Link>
                    </li>
                    {isAuthenticated ? (
                            <li>
                                <Link to="/account">Личный кабинет</Link>
                            </li>
                    ) : (
                            <>
                                <li>
                                    <Link to="/login">Вход</Link>
                                </li>
                                <li>
                                    <Link to="/register">Регистрация</Link>
                                </li>
                            </>
                    )}
                </ul>
            </nav>
    );
}

export default NavBar;
