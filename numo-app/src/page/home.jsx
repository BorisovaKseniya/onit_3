import {useEffect, useState} from "react";
import React from 'react';
import '../style/home.css'
import {useNavigate} from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Home = () => {

    // Состояния для хранения имени и фимилии
    const [firstName, setfirstName] = useState("");
    const [secondName, setsecondName] = useState("");

    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
        }
        else{
            // Раскодируем токен
            const decoded = jwtDecode(token);
            console.log(decoded); // { sub: "user@example.com", firstName: "Александр", lastName: "Петров", iat: ..., exp: ... }

            // Используем данные
            const name = `${decoded.firstName}`;
            const lastName = `${decoded.secondName}`;
            setfirstName(name);
            setsecondName(lastName);
            console.log(firstName,secondName);
        }

    }, []);


    return (
        <div className="welcome-card">
                    <h2>Добро пожаловать, {firstName}!</h2>


                <div className="stats-card">
                    <h2 className="stats-title">Статистика аккаунта</h2>
                    <div className="stats-grid">
                        <div className="stat-item">
                            <span className="stat-number">
                                {(() => {
                                    const operations = JSON.parse(localStorage.getItem("userOperations") || "[]");
                                    return operations.length;
                                })()}
                            </span>
                            <span className="stat-label">Всего операций</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">
                                {(() => {
                                    const categories = JSON.parse(localStorage.getItem("userCategories") || "{}");
                                    const expenseCats = categories.expense || [];
                                    const incomeCats = categories.income || [];
                                    return expenseCats.length + incomeCats.length;
                                })()}
                            </span>
                            <span className="stat-label">Категорий</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">
                                {(() => {
                                    const operations = JSON.parse(localStorage.getItem("userOperations") || "[]");
                                    const firstOp = operations[operations.length - 1];
                                    const lastOp = operations[0];

                                    if (operations.length < 2) return "0";

                                    if (firstOp && lastOp) {
                                        const firstDate = new Date(firstOp.date);
                                        const lastDate = new Date(lastOp.date);
                                        const diffTime = Math.abs(lastDate - firstDate);
                                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                        return diffDays;
                                    }
                                    return "0";
                                })()}
                            </span>
                            <span className="stat-label">Дней активности</span>
                        </div>
                    </div>
                </div>

    {/*
                            <div className="stats-grid">
                                <div className="stat-card">
                                    <div className="stat-value">12</div>
                                    <div className="stat-label">Проектов</div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-value">47</div>
                                    <div className="stat-label">Задач выполнено</div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-value">89%</div>
                                    <div className="stat-label">Продуктивность</div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-value">24</div>
                                    <div className="stat-label">Часов на этой неделе</div>
                                </div>
                            </div>*/}

        </div>

    )}

export default Home;