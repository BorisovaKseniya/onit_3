import React from 'react';
import '../style/login.css'
import {useNavigate} from "react-router-dom";
const Login = () => {

    const navigate = useNavigate();
    const goToRegister = () => {
        navigate("/register"); // переход на страницу регистрации
    };

    const login = async (email, password) => {
        console.log("Логин:", email, password);

            // Простая валидация
            if (!email || !password) {
                alert('Пожалуйста, заполните все поля');
                return;
            }
            fetch('http://localhost:8080/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            })
                .then(async response => {
                    if (response.ok) {
                        // Перенаправляем в личный кабинет (без сессии)
                        const data = await response.json();
                        // Сохраняем токен в localStorage
                        localStorage.setItem('token', data.token);
                        console.log("Токен:", data.token);
                        // Переходим на главную страницу
                        navigate("/");
                    } else {
                        const err = await response.text();
                        alert('Ошибка входа');
                    }
                })
                .catch(error => {
                    console.error('Ошибка запроса:', error);
                    alert('Произошла ошибка при входе.');
                });

    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        login(email, password);
    };

    return (
        <div className="login-container">
        <h1>Вход</h1>

        <form id="loginForm" onSubmit={handleSubmit}>
                <div className="form-group">
                    <input type="email" id="email" placeholder="Email" required/>
                </div>
                <div className="form-group">
                    <input type="password" id="password" placeholder="Пароль" required/>
                </div>

                <button  className="login-btn">Войти</button>
            </form>

            <div className="divider">
                <span>или</span>
            </div>

            <button className="register-btn" id="registerBtn" onClick={goToRegister}>Создать аккаунт</button>

            <div className="forgot-password">
                <a href="#">Забыли пароль?</a>
            </div>
        </div>
    )
}

export default Login;