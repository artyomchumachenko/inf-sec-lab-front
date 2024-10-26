// utils/authFetch.js
export const authFetch = async (url, options = {}) => {
    // Получаем токен из localStorage
    const token = localStorage.getItem('token');

    // Добавляем Authorization заголовок, если токен существует
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const response = await fetch(url, {
        ...options,
        headers,
    });

    return response;
};
