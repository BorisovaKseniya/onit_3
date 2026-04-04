import { useEffect } from "react";
import React from 'react';
import '../style/home.css'
import {useNavigate} from "react-router-dom";
const Header = ({ children }) => {

    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
        }
    }, []);

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    // Переход на страницу регистрации
    const goToOperations = () => {
        navigate("/operations");
    };

    const goToAnalytics= () => {
        navigate("/analytics");
    };



    const goToProfile = () => {
        navigate("/profile");
    };

    const goHome = () => {
        navigate("/");
    };


    return (
        <div>
        <header className="header">
            <div className="container">
                <div className="header-content">
                    <div className="logo">МойКабинет</div>
                    <div className="user-menu">
                        <div className="user-info">
                            {/*<div className="user-name">Александр Петров</div>
                            <div className="user-email">alex.petrov@example.com</div>*/}
                        </div>
                        <button className="logout-btn" id="logoutBtn" onClick={logout}>Выйти</button>
                    </div>
                </div>
            </div>
        </header>
            <div className="container">
                <div className="dashboard">
                    <aside className="sidebar">
                        <div className="nav-item" data-section="dashboard" onClick={goHome} >
                            📊 Обзор
                        </div>
                    {/*    <div className="nav-item" data-section="profile">
                            💳 Счета
                        </div>*/}
                        <div className="nav-item" data-section="security" onClick={goToOperations}>
                            💸 Мои Операции
                        </div>
                        <div className="nav-item" data-section="security" onClick={goToAnalytics}>
                            📈 Аналитика
                        </div>
                        <div className="nav-item" data-section="billing" onClick={goToProfile}>
                            👥 Мой профиль
                        </div>
                      {/*  <div className="nav-item" data-section="activity">
                            📊 Аналитика
                        </div>
                        <div className="nav-item" data-section="settings">
                            ⚙️ Настройки
                        </div>*/}
                    </aside>
                    <main>{children}</main>
                </div>
            </div>
        </div>
    )
}

export default Header;