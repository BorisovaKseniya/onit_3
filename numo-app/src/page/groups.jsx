import { useEffect, useState } from "react";
import React from 'react';
import '../style/groups.css';
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Groups = () => {
    const [firstName, setFirstName] = useState("");
    const [secondName, setSecondName] = useState("");
    const [groups, setGroups] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [showOperationModal, setShowOperationModal] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState(null);

    // Состояние для формы создания группы
    const [newGroup, setNewGroup] = useState({
        name: "",
        description: "",
        currency: "RUB"
    });

    // Состояние для формы присоединения к группе
    const [joinCode, setJoinCode] = useState("");

    // Состояние для формы групповой операции
    const [groupOperation, setGroupOperation] = useState({
        type: "expense",
        amount: "",
        category: "",
        description: "",
        date: new Date().toISOString().split('T')[0],
        participants: []
    });

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
        } else {
            const decoded = jwtDecode(token);
            setFirstName(decoded.firstName || "");
            setSecondName(decoded.secondName || "");

            // Загрузка групп из localStorage
            const savedGroups = localStorage.getItem("userGroups");
            if (savedGroups) {
                setGroups(JSON.parse(savedGroups));
            }
        }
    }, []);

    // Обработчики для форм
    const handleGroupInputChange = (e) => {
        const { name, value } = e.target;
        setNewGroup(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleOperationInputChange = (e) => {
        const { name, value } = e.target;
        setGroupOperation(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Создание новой группы
    const handleCreateGroup = (e) => {
        e.preventDefault();

        if (!newGroup.name) {
            alert("Пожалуйста, введите название группы");
            return;
        }

        const group = {
            id: Date.now().toString(),
            code: generateGroupCode(),
            name: newGroup.name,
            description: newGroup.description,
            currency: newGroup.currency,
            createdBy: `${firstName} ${secondName}`,
            createdAt: new Date().toISOString(),
            members: [
                {
                    id: Date.now().toString(),
                    name: `${firstName} ${secondName}`,
                    role: "admin"
                }
            ],
            operations: []
        };

        const updatedGroups = [...groups, group];
        setGroups(updatedGroups);
        localStorage.setItem("userGroups", JSON.stringify(updatedGroups));

        setNewGroup({
            name: "",
            description: "",
            currency: "RUB"
        });
        setShowCreateModal(false);

        alert(`Группа "${group.name}" создана! Код для присоединения: ${group.code}`);
    };

    // Присоединение к группе
    const handleJoinGroup = (e) => {
        e.preventDefault();

        if (!joinCode) {
            alert("Пожалуйста, введите код группы");
            return;
        }

        // В реальном приложении здесь был бы запрос к API
        // Для демонстрации создаем mock группу
        const mockGroup = {
            id: (Date.now() + 1).toString(),
            code: joinCode,
            name: `Группа ${joinCode}`,
            description: "Описание группы",
            currency: "RUB",
            createdBy: "Другой пользователь",
            createdAt: new Date().toISOString(),
            members: [
                {
                    id: "1",
                    name: "Другой пользователь",
                    role: "admin"
                },
                {
                    id: Date.now().toString(),
                    name: `${firstName} ${secondName}`,
                    role: "member"
                }
            ],
            operations: []
        };

        const updatedGroups = [...groups, mockGroup];
        setGroups(updatedGroups);
        localStorage.setItem("userGroups", JSON.stringify(updatedGroups));

        setJoinCode("");
        setShowJoinModal(false);

        alert(`Вы присоединились к группе "${mockGroup.name}"!`);
    };

    // Добавление групповой операции
    const handleAddGroupOperation = (e) => {
        e.preventDefault();

        if (!groupOperation.amount || !groupOperation.category) {
            alert("Пожалуйста, заполните обязательные поля");
            return;
        }

        const operation = {
            id: Date.now().toString(),
            type: groupOperation.type,
            amount: parseFloat(groupOperation.amount),
            category: groupOperation.category,
            description: groupOperation.description,
            date: groupOperation.date,
            createdBy: `${firstName} ${secondName}`,
            createdAt: new Date().toISOString(),
            participants: selectedGroup.members.map(member => ({
                ...member,
                share: parseFloat(groupOperation.amount) / selectedGroup.members.length
            }))
        };

        const updatedGroups = groups.map(group => {
            if (group.id === selectedGroup.id) {
                return {
                    ...group,
                    operations: [operation, ...group.operations].slice(0, 50)
                };
            }
            return group;
        });

        setGroups(updatedGroups);
        localStorage.setItem("userGroups", JSON.stringify(updatedGroups));

        setGroupOperation({
            type: "expense",
            amount: "",
            category: "",
            description: "",
            date: new Date().toISOString().split('T')[0],
            participants: []
        });
        setShowOperationModal(false);
        setSelectedGroup(null);

        alert("Групповая операция добавлена!");
    };

    // Генерация кода группы
    const generateGroupCode = () => {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    };

    // Категории для операций
    const categories = {
        expense: ["Еда", "Транспорт", "Жилье", "Развлечения", "Здоровье", "Одежда", "Другое"],
        income: ["Зарплата", "Инвестиции", "Подарки", "Возврат", "Другое"]
    };

    // Получение общей суммы операций в группе
    const getGroupTotal = (group) => {
        return group.operations.reduce((total, op) => {
            return op.type === 'income' ? total + op.amount : total - op.amount;
        }, 0);
    };

    return (
        <main className="main-content">
            {/* Заголовок и кнопки действий */}
            <section className="content-section">
                <div className="section-header">
                    <h2 className="section-title">Мои группы ({groups.length})</h2>
                    <div className="action-buttons">
                        <button
                            className="primary-btn"
                            onClick={() => setShowCreateModal(true)}
                        >
                            Создать группу
                        </button>
                        <button
                            className="secondary-btn"
                            onClick={() => setShowJoinModal(true)}
                        >
                            Присоединиться
                        </button>
                    </div>
                </div>
            </section>

            {/* Список групп */}
            <section className="content-section">
                {groups.length === 0 ? (
                    <div className="empty-state">
                        <p>У вас пока нет групп. Создайте первую или присоединитесь к существующей!</p>
                    </div>
                ) : (
                    <div className="groups-list">
                        {groups.map(group => (
                            <div key={group.id} className="group-item">
                                <div className="group-header">
                                    <div className="group-info">
                                        <h3 className="group-name">{group.name}</h3>
                                        <p className="group-description">{group.description}</p>
                                        <div className="group-meta">
                                            <span className="group-code">Код: {group.code}</span>
                                            <span className="group-currency">Валюта: {group.currency}</span>
                                        </div>
                                    </div>
                                    <div className="group-actions">
                                        <button
                                            className="operation-btn"
                                            onClick={() => {
                                                setSelectedGroup(group);
                                                setShowOperationModal(true);
                                            }}
                                        >
                                            Добавить операцию
                                        </button>
                                    </div>
                                </div>

                                <div className="group-details">
                                    <div className="group-members">
                                        <strong>Участники:</strong>
                                        {group.members.map(member => (
                                            <span key={member.id} className="member-tag">
                                                {member.name} {member.role === 'admin' && '👑'}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="group-stats">
                                        <div className="stat">
                                            <span className="stat-label">Операций:</span>
                                            <span className="stat-value">{group.operations.length}</span>
                                        </div>
                                        <div className="stat">
                                            <span className="stat-label">Баланс:</span>
                                            <span className={`stat-value ${getGroupTotal(group) >= 0 ? 'positive' : 'negative'}`}>
                                                {getGroupTotal(group)} {group.currency}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Последние операции группы */}
                                {group.operations.length > 0 && (
                                    <div className="group-operations">
                                        <h4>Последние операции:</h4>
                                        <div className="operations-preview">
                                            {group.operations.slice(0, 3).map(operation => (
                                                <div key={operation.id} className={`operation-preview ${operation.type}`}>
                                                    <span className="preview-category">{operation.category}</span>
                                                    <span className={`preview-amount ${operation.type}`}>
                                                        {operation.type === 'expense' ? '-' : '+'}{operation.amount} {group.currency}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Модальное окно создания группы */}
            {showCreateModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h3>Создать новую группу</h3>
                            <button
                                className="close-btn"
                                onClick={() => setShowCreateModal(false)}
                            >
                                ×
                            </button>
                        </div>
                        <form onSubmit={handleCreateGroup} className="profile-form">
                            <div className="form-group">
                                <label>Название группы *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={newGroup.name}
                                    onChange={handleGroupInputChange}
                                    placeholder="Введите название группы"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Описание</label>
                                <textarea
                                    name="description"
                                    value={newGroup.description}
                                    onChange={handleGroupInputChange}
                                    placeholder="Описание группы"
                                    rows="3"
                                />
                            </div>
                            <div className="form-group">
                                <label>Валюта</label>
                                <select
                                    name="currency"
                                    value={newGroup.currency}
                                    onChange={handleGroupInputChange}
                                    className="form-select"
                                >
                                    <option value="RUB">RUB - Российский рубль</option>
                                    <option value="USD">USD - Доллар США</option>
                                    <option value="EUR">EUR - Евро</option>
                                </select>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="secondary-btn" onClick={() => setShowCreateModal(false)}>
                                    Отмена
                                </button>
                                <button type="submit" className="primary-btn">
                                    Создать группу
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Модальное окно присоединения к группе */}
            {showJoinModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h3>Присоединиться к группе</h3>
                            <button
                                className="close-btn"
                                onClick={() => setShowJoinModal(false)}
                            >
                                ×
                            </button>
                        </div>
                        <form onSubmit={handleJoinGroup} className="profile-form">
                            <div className="form-group">
                                <label>Код группы *</label>
                                <input
                                    type="text"
                                    value={joinCode}
                                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                                    placeholder="Введите код группы"
                                    required
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="secondary-btn" onClick={() => setShowJoinModal(false)}>
                                    Отмена
                                </button>
                                <button type="submit" className="primary-btn">
                                    Присоединиться
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Модальное окно добавления групповой операции */}
            {showOperationModal && selectedGroup && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h3>Добавить операцию в "{selectedGroup.name}"</h3>
                            <button
                                className="close-btn"
                                onClick={() => {
                                    setShowOperationModal(false);
                                    setSelectedGroup(null);
                                }}
                            >
                                ×
                            </button>
                        </div>
                        <form onSubmit={handleAddGroupOperation} className="profile-form">
                            <div className="form-group">
                                <label>Тип операции *</label>
                                <select
                                    name="type"
                                    value={groupOperation.type}
                                    onChange={handleOperationInputChange}
                                    className="form-select"
                                >
                                    <option value="expense">Расход</option>
                                    <option value="income">Доход</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Сумма *</label>
                                <input
                                    type="number"
                                    name="amount"
                                    value={groupOperation.amount}
                                    onChange={handleOperationInputChange}
                                    placeholder="Введите сумму"
                                    min="0"
                                    step="0.01"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Категория *</label>
                                <select
                                    name="category"
                                    value={groupOperation.category}
                                    onChange={handleOperationInputChange}
                                    className="form-select"
                                    required
                                >
                                    <option value="">Выберите категорию</option>
                                    {categories[groupOperation.type].map(category => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Описание</label>
                                <input
                                    type="text"
                                    name="description"
                                    value={groupOperation.description}
                                    onChange={handleOperationInputChange}
                                    placeholder="Краткое описание операции"
                                />
                            </div>

                            <div className="form-group">
                                <label>Дата</label>
                                <input
                                    type="date"
                                    name="date"
                                    value={groupOperation.date}
                                    onChange={handleOperationInputChange}
                                />
                            </div>

                            <div className="modal-actions">
                                <button
                                    type="button"
                                    className="secondary-btn"
                                    onClick={() => {
                                        setShowOperationModal(false);
                                        setSelectedGroup(null);
                                    }}
                                >
                                    Отмена
                                </button>
                                <button type="submit" className="primary-btn">
                                    Добавить операцию
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
};

export default Groups;