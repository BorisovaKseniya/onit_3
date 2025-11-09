import { useEffect } from "react";
import React from 'react';
import '../style/home.css'
import {useNavigate} from "react-router-dom";
const Home = () => {

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
    return (
        <div className="dashboard">
            <h1>Добро пожаловать в личный кабинет</h1>

            <div className="user-info">
                <div className="user-name">Александр Петров</div>
                <div className="user-email">alex.petrov@example.com</div>
            </div>

            <button className="logout-btn" id="logoutBtn" onClick={logout}>Выйти</button>
        </div>
    )
}

export default Home;