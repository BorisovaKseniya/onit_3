import React from 'react';
import '../style/register.css'
import {useNavigate} from "react-router-dom";


const Register = () => {

    // Переход на страницу Авторизации
    const navigate = useNavigate();
    const goToLogin = () => {
        navigate("/"); // переход на страницу регистрации
    };

    // Запрос к сереверу для регистрации
    const register = async (firstName, secondName, email, password, confirmPassword) => {
        console.log("Логин:", email, password,confirmPassword,firstName, secondName);

        // Простая валидация
        if (!email || !password || !confirmPassword || !firstName || !secondName) {
            alert('Пожалуйста, заполните все поля');
            return;
        }

        console.log("Пароли ", password, " ", confirmPassword);
        if (password !== confirmPassword) {
            alert('Пароли не совпадают');
            return;
        }

        if (password.length < 8) {
            alert('Пароль должен содержать минимум 8 символов');
            return;
        }

        // Запрос
        fetch('http://localhost:8080/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                firstName: firstName,
                secondName: secondName,
                email: email,
                password: password,
            })
        })
            .then(async response => {
                if (response.ok) {
                    alert('Регистрация прошла успешно!');
                    // Редирект на страницу логина
                    navigate("/login");
                } else {
                    const errorText = await response.text();
                    alert('Ошибка регистрации: ' + errorText);

                }
            })
            .catch(err => {
                console.error('Ошибка запроса:', err);
                alert('Произошла ошибка. Попробуйте позже.');
            });



    };
    const handleSubmit = (e) => {
        e.preventDefault();
        const formElements = e.target.elements; // HTMLFormControlsCollection
        const firstName = formElements.firstName.value;
        const secondName = formElements.secondName.value;
        const email = formElements.email.value;
        const password = formElements.password.value;
        const confirmPassword = formElements.confirmPassword.value;
        register(firstName,secondName,email, password, confirmPassword);
    };


    return (
        <div className="register-container">
            <h1>Создать аккаунт</h1>
            <form id="registerForm" onSubmit={handleSubmit}>

                <div className="form-group">
                    <input type="text" id="firstName" name="firstName" placeholder="Имя" required/>
                </div>
                <div className="form-group">
                    <input type="text" id="secondName" name="secondName" placeholder="Фамилия" required/>
                </div>

                <div className="form-group">
                    <input type="email" id="email" placeholder="Email" required/>
                </div>


                <div className="form-group">
                    <input type="password" id="password" placeholder="Пароль" required/>
                    <div className="password-requirements">Минимум 8 символов, включая цифры и буквы</div>
                </div>

                <div className="form-group">
                    <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Повторите пароль" required/>
                </div>

                <button type="submit" className="register-btn">Зарегистрироваться </button>
            </form>

            <div className="terms">
                Нажимая "Зарегистрироваться", вы соглашаетесь с <a href="#">условиями использования</a> и <a href="#">политикой
                конфиденциальности</a>
            </div>

            <div className="divider">
                <span>Уже есть аккаунт?</span>
            </div>

            <button className="login-btn" id="loginBtn" onClick={goToLogin}>Войти</button>
        </div>
    )
}
export default Register;