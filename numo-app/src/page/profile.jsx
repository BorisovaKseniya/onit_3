import { useEffect, useState } from "react";
import React from 'react';
import '../style/profile.css';
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Profile = () => {
    const [userData, setUserData] = useState({
        firstName: "",
        secondName: "",
        email: ""
    });

    const [editMode, setEditMode] = useState(false);
    const [passwordMode, setPasswordMode] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });

    const [formData, setFormData] = useState({
        firstName: "",
        secondName: "",
        email: "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [passwordErrors, setPasswordErrors] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
        } else {
            try {
                const decoded = jwtDecode(token);
                const userInfo = {
                    firstName: decoded.firstName || "",
                    secondName: decoded.secondName || "",
                    email: decoded.sub || decoded.email || ""
                };

                setUserData(userInfo);
                setFormData({
                    ...userInfo,
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: ""
                });
            } catch (error) {
                console.error("Ошибка декодирования токена:", error);
                setMessage({
                    text: "Ошибка загрузки данных профиля",
                    type: "error"
                });
            }
        }
    }, [navigate]);

    // Загрузка данных пользователя из localStorage (если есть)
    useEffect(() => {
        const savedProfile = localStorage.getItem("userProfile");
        if (savedProfile) {
            try {
                const profileData = JSON.parse(savedProfile);
                setUserData(prev => ({ ...prev, ...profileData }));
                setFormData(prev => ({ ...prev, ...profileData }));
            } catch (error) {
                console.error("Ошибка загрузки профиля из localStorage:", error);
            }
        }
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Очищаем ошибки при вводе
        if (passwordMode && passwordErrors[name]) {
            setPasswordErrors(prev => ({
                ...prev,
                [name]: ""
            }));
        }
    };

    const validatePassword = () => {
        const errors = {
            currentPassword: "",
            newPassword: "",
            confirmPassword: ""
        };
        let isValid = true;

        if (passwordMode) {
            if (!formData.currentPassword.trim()) {
                errors.currentPassword = "Введите текущий пароль";
                isValid = false;
            }

            if (!formData.newPassword.trim()) {
                errors.newPassword = "Введите новый пароль";
                isValid = false;
            } else if (formData.newPassword.length < 6) {
                errors.newPassword = "Пароль должен содержать минимум 6 символов";
                isValid = false;
            }

            if (!formData.confirmPassword.trim()) {
                errors.confirmPassword = "Подтвердите новый пароль";
                isValid = false;
            } else if (formData.newPassword !== formData.confirmPassword) {
                errors.confirmPassword = "Пароли не совпадают";
                isValid = false;
            }
        }

        setPasswordErrors(errors);
        return isValid;
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage({ text: "", type: "" });

        try {
            // В реальном приложении здесь был бы запрос к API
            // Для демо симулируем задержку
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Проверяем, изменились ли данные
            const hasChanges =
                formData.firstName !== userData.firstName ||
                formData.secondName !== userData.secondName ||
                formData.email !== userData.email;

            if (!hasChanges && !passwordMode) {
                setMessage({
                    text: "Данные не изменены",
                    type: "info"
                });
                setEditMode(false);
                setIsLoading(false);
                return;
            }

            if (passwordMode && !validatePassword()) {
                setIsLoading(false);
                return;
            }

            // Обновляем токен с новыми данными (в реальном приложении нужно получать новый токен с сервера)
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    const decoded = jwtDecode(token);
                    // Создаем новый объект с обновленными данными
                    const updatedTokenData = {
                        ...decoded,
                        firstName: formData.firstName,
                        secondName: formData.secondName,
                        sub: formData.email,
                        email: formData.email
                    };

                    // В реальном приложении здесь должен быть запрос на обновление токена
                    // Для демо просто сохраняем данные в localStorage
                    localStorage.setItem("userProfile", JSON.stringify({
                        firstName: formData.firstName,
                        secondName: formData.secondName,
                        email: formData.email
                    }));
                } catch (error) {
                    console.error("Ошибка обновления токена:", error);
                }
            }

            // Обновляем состояние пользователя
            const updatedUserData = {
                firstName: formData.firstName,
                secondName: formData.secondName,
                email: formData.email
            };

            setUserData(updatedUserData);

            // Если меняли пароль, сбрасываем поля пароля
            if (passwordMode) {
                setFormData(prev => ({
                    ...prev,
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: ""
                }));
                setPasswordMode(false);
            }

            setEditMode(false);
            setMessage({
                text: passwordMode ? "Пароль успешно изменен!" : "Профиль успешно обновлен!",
                type: "success"
            });

        } catch (error) {
            console.error("Ошибка сохранения профиля:", error);
            setMessage({
                text: "Произошла ошибка при сохранении",
                type: "error"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancelEdit = () => {
        setFormData({
            firstName: userData.firstName,
            secondName: userData.secondName,
            email: userData.email,
            currentPassword: "",
            newPassword: "",
            confirmPassword: ""
        });
        setEditMode(false);
        setPasswordMode(false);
        setPasswordErrors({
            currentPassword: "",
            newPassword: "",
            confirmPassword: ""
        });
        setMessage({ text: "", type: "" });
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userProfile");
        navigate("/login");
    };

    const handleDeleteAccount = () => {
        if (window.confirm("Вы уверены, что хотите удалить аккаунт? Это действие необратимо.")) {
            // В реальном приложении здесь был бы запрос к API
            localStorage.removeItem("token");
            localStorage.removeItem("userProfile");
            localStorage.removeItem("userOperations");
            localStorage.removeItem("userCategories");

            setMessage({
                text: "Аккаунт удален",
                type: "success"
            });

            setTimeout(() => {
                navigate("/login");
            }, 1500);
        }
    };

    return (
        <main className="main-content">
            {/* Заголовок */}
            <section className="content-section">
                <div className="profile-header">
                    <h1 className="page-title">Мой профиль</h1>
                    <p className="page-subtitle">Управление вашими личными данными и настройками</p>
                </div>
            </section>

            {/* Сообщения */}
            {message.text && (
                <section className="content-section">
                    <div className={`message-alert ${message.type}`}>
                        {message.text}
                        <button
                            className="close-alert"
                            onClick={() => setMessage({ text: "", type: "" })}
                        >
                            ×
                        </button>
                    </div>
                </section>
            )}

            {/* Основная информация профиля */}
            <section className="content-section">
                <div className="profile-card">
                    <div className="profile-card-header">
                        <h2 className="profile-card-title">Личная информация</h2>
                        {!editMode && (
                            <button
                                className="edit-profile-btn"
                                onClick={() => setEditMode(true)}
                            >
                                ✏️ Редактировать
                            </button>
                        )}
                    </div>

                    {!editMode ? (
                        // Режим просмотра
                        <div className="profile-info-view">
                            <div className="profile-info-item">
                                <span className="info-label">Имя:</span>
                                <span className="info-value">{userData.firstName || "Не указано"}</span>
                            </div>
                            <div className="profile-info-item">
                                <span className="info-label">Фамилия:</span>
                                <span className="info-value">{userData.secondName || "Не указано"}</span>
                            </div>
                            <div className="profile-info-item">
                                <span className="info-label">Email:</span>
                                <span className="info-value">{userData.email || "Не указано"}</span>
                            </div>
                            <div className="profile-info-item">
                                <span className="info-label">Дата регистрации:</span>
                                <span className="info-value">
                                    {(() => {
                                        const token = localStorage.getItem("token");
                                        if (token) {
                                            try {
                                                const decoded = jwtDecode(token);
                                                if (decoded.iat) {
                                                    return new Date(decoded.iat * 1000).toLocaleDateString('ru-RU');
                                                }
                                            } catch (e) {
                                                // ignore
                                            }
                                        }
                                        return "Неизвестно";
                                    })()}
                                </span>
                            </div>
                        </div>
                    ) : (
                        // Режим редактирования
                        <form onSubmit={handleSaveProfile} className="profile-form">
                            <div className="form-group">
                                <label htmlFor="firstName">Имя</label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    placeholder="Введите ваше имя"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="secondName">Фамилия</label>
                                <input
                                    type="text"
                                    id="secondName"
                                    name="secondName"
                                    value={formData.secondName}
                                    onChange={handleInputChange}
                                    placeholder="Введите вашу фамилию"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="Введите ваш email"
                                    required
                                />
                            </div>

                            {/* Переключатель смены пароля */}
                            <div className="password-toggle">
                                <button
                                    type="button"
                                    className={`password-toggle-btn ${passwordMode ? 'active' : ''}`}
                                    onClick={() => setPasswordMode(!passwordMode)}
                                >
                                    {passwordMode ? '✖ Отменить смену пароля' : '🔒 Сменить пароль'}
                                </button>
                            </div>

                            {/* Поля для смены пароля */}
                            {passwordMode && (
                                <div className="password-change-section">
                                    <div className="form-group">
                                        <label htmlFor="currentPassword">Текущий пароль *</label>
                                        <input
                                            type="password"
                                            id="currentPassword"
                                            name="currentPassword"
                                            value={formData.currentPassword}
                                            onChange={handleInputChange}
                                            placeholder="Введите текущий пароль"
                                            required={passwordMode}
                                        />
                                        {passwordErrors.currentPassword && (
                                            <span className="error-message">{passwordErrors.currentPassword}</span>
                                        )}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="newPassword">Новый пароль *</label>
                                        <input
                                            type="password"
                                            id="newPassword"
                                            name="newPassword"
                                            value={formData.newPassword}
                                            onChange={handleInputChange}
                                            placeholder="Введите новый пароль"
                                            required={passwordMode}
                                        />
                                        {passwordErrors.newPassword && (
                                            <span className="error-message">{passwordErrors.newPassword}</span>
                                        )}
                                        <div className="password-hint">
                                            Пароль должен содержать минимум 6 символов
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="confirmPassword">Подтвердите пароль *</label>
                                        <input
                                            type="password"
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleInputChange}
                                            placeholder="Повторите новый пароль"
                                            required={passwordMode}
                                        />
                                        {passwordErrors.confirmPassword && (
                                            <span className="error-message">{passwordErrors.confirmPassword}</span>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="form-actions">
                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={handleCancelEdit}
                                    disabled={isLoading}
                                >
                                    Отмена
                                </button>
                                <button
                                    type="submit"
                                    className="save-btn"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Сохранение...' : 'Сохранить изменения'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </section>

          

            {/* Статистика (опционально) */}

        </main>
    );
};

export default Profile;