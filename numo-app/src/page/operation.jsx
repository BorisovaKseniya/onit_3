import {useEffect, useState} from "react";
import React from 'react';
import '../style/operation.css'
import {useNavigate} from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Operation = () => {
    const [firstName, setFirstName] = useState("");
    const [secondName, setSecondName] = useState("");
    const [operations, setOperations] = useState([]);
    const [filteredOperations, setFilteredOperations] = useState([]);
    const [showCustomCategoryModal, setShowCustomCategoryModal] = useState(false);
    const [customCategoryName, setCustomCategoryName] = useState("");

    // Состояния для фильтров и сортировки
    const [filters, setFilters] = useState({
        type: "all",
        category: "all",
        dateFrom: "",
        dateTo: "",
        amountFrom: "",
        amountTo: ""
    });

    const [sortBy, setSortBy] = useState("date");
    const [sortOrder, setSortOrder] = useState("desc");
    const [showFilters, setShowFilters] = useState(false);

    // Состояние для формы добавления операции
    const [newOperation, setNewOperation] = useState({
        type: "expense",
        amount: "",
        category: "",
        description: "",
        date: new Date().toISOString().split('T')[0]
    });

    const navigate = useNavigate();

    // Загрузка категорий из localStorage или использование стандартных
    const getInitialCategories = () => {
        const savedCategories = localStorage.getItem("userCategories");
        if (savedCategories) {
            return JSON.parse(savedCategories);
        }
        return {
            expense: ["Еда", "Транспорт", "Жилье", "Развлечения", "Здоровье", "Одежда", "Другое"],
            income: ["Зарплата", "Инвестиции", "Подарки", "Возврат", "Другое"]
        };
    };

    const [categories, setCategories] = useState(getInitialCategories);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
        } else {
            const decoded = jwtDecode(token);
            setFirstName(decoded.firstName || "");
            setSecondName(decoded.secondName || "");

            // Загрузка операций из localStorage
            const savedOperations = localStorage.getItem("userOperations");
            if (savedOperations) {
                const loadedOperations = JSON.parse(savedOperations);
                setOperations(loadedOperations);
                setFilteredOperations(loadedOperations);
            }

            // Загрузка категорий из localStorage
            const savedCategories = localStorage.getItem("userCategories");
            if (savedCategories) {
                setCategories(JSON.parse(savedCategories));
            }
        }
    }, []);

    // Сохранение категорий в localStorage
    useEffect(() => {
        localStorage.setItem("userCategories", JSON.stringify(categories));
    }, [categories]);

    // Применение фильтров и сортировки при изменении операций, фильтров или сортировки
    useEffect(() => {
        applyFiltersAndSorting();
    }, [operations, filters, sortBy, sortOrder]);

    // Функция применения фильтров и сортировки
    const applyFiltersAndSorting = () => {
        let result = [...operations];

        // Применяем фильтры
        if (filters.type !== "all") {
            result = result.filter(op => op.type === filters.type);
        }

        if (filters.category !== "all") {
            result = result.filter(op => op.category === filters.category);
        }

        if (filters.dateFrom) {
            result = result.filter(op => new Date(op.date) >= new Date(filters.dateFrom));
        }

        if (filters.dateTo) {
            result = result.filter(op => new Date(op.date) <= new Date(filters.dateTo));
        }

        if (filters.amountFrom) {
            result = result.filter(op => op.amount >= parseFloat(filters.amountFrom));
        }

        if (filters.amountTo) {
            result = result.filter(op => op.amount <= parseFloat(filters.amountTo));
        }

        // Применяем сортировку
        result.sort((a, b) => {
            let aValue, bValue;

            switch (sortBy) {
                case "date":
                    aValue = new Date(a.date);
                    bValue = new Date(b.date);
                    break;
                case "amount":
                    aValue = a.amount;
                    bValue = b.amount;
                    break;
                case "category":
                    aValue = a.category.toLowerCase();
                    bValue = b.category.toLowerCase();
                    break;
                case "type":
                    aValue = a.type;
                    bValue = b.type;
                    break;
                default:
                    aValue = new Date(a.date);
                    bValue = new Date(b.date);
            }

            if (sortOrder === "asc") {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        setFilteredOperations(result);
    };

    // Обработчик изменения фильтров
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Обработчик изменения сортировки
    const handleSortChange = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortBy(field);
            setSortOrder("desc");
        }
    };

    // Сброс всех фильтров
    const resetFilters = () => {
        setFilters({
            type: "all",
            category: "all",
            dateFrom: "",
            dateTo: "",
            amountFrom: "",
            amountTo: ""
        });
    };

    // Обработчик изменения полей формы
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewOperation(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Добавление новой операции
    const handleAddOperation = (e) => {
        e.preventDefault();

        if (!newOperation.amount || !newOperation.category) {
            alert("Пожалуйста, заполните обязательные поля");
            return;
        }

        const operation = {
            id: Date.now(),
            type: newOperation.type,
            amount: parseFloat(newOperation.amount),
            category: newOperation.category,
            description: newOperation.description,
            date: newOperation.date,
            createdAt: new Date().toISOString()
        };

        const updatedOperations = [operation, ...operations].slice(0, 50);
        setOperations(updatedOperations);
        localStorage.setItem("userOperations", JSON.stringify(updatedOperations));

        // Сбрасываем форму
        setNewOperation({
            type: "expense",
            amount: "",
            category: "",
            description: "",
            date: new Date().toISOString().split('T')[0]
        });

        alert("Операция успешно добавлена!");
    };

    // Добавление пользовательской категории
    const handleAddCustomCategory = (e) => {
        e.preventDefault();

        if (!customCategoryName.trim()) {
            alert("Пожалуйста, введите название категории");
            return;
        }

        const categoryType = newOperation.type;
        const updatedCategories = {
            ...categories,
            [categoryType]: [...categories[categoryType], customCategoryName.trim()]
        };

        setCategories(updatedCategories);

        // Автоматически выбираем новую категорию в форме
        setNewOperation(prev => ({
            ...prev,
            category: customCategoryName.trim()
        }));

        setCustomCategoryName("");
        setShowCustomCategoryModal(false);

        alert(`Категория "${customCategoryName}" успешно добавлена!`);
    };

    // Удаление категории
    const handleDeleteCategory = (categoryType, categoryToDelete) => {
        if (window.confirm(`Вы уверены, что хотите удалить категорию "${categoryToDelete}"?`)) {
            const updatedCategories = {
                ...categories,
                [categoryType]: categories[categoryType].filter(cat => cat !== categoryToDelete)
            };

            setCategories(updatedCategories);

            // Если удаляемая категория была выбрана в форме, сбрасываем выбор
            if (newOperation.category === categoryToDelete && newOperation.type === categoryType) {
                setNewOperation(prev => ({
                    ...prev,
                    category: ""
                }));
            }
        }
    };

    // Открытие модального окна для добавления категории
    const handleOpenAddCategory = () => {
        setCustomCategoryName("");
        setShowCustomCategoryModal(true);
    };

    // Получение иконки сортировки
    const getSortIcon = (field) => {
        if (sortBy !== field) return "↕️";
        return sortOrder === "asc" ? "↑" : "↓";
    };

    // Статистика
    const totalIncome = filteredOperations
        .filter(op => op.type === "income")
        .reduce((sum, op) => sum + op.amount, 0);

    const totalExpense = filteredOperations
        .filter(op => op.type === "expense")
        .reduce((sum, op) => sum + op.amount, 0);

    const balance = totalIncome - totalExpense;

    return (
        <main className="main-content">
            {/* Секция добавления операции */}
            <section className="content-section">
                <div className="section-header">
                    <h2 className="section-title">Добавить операцию</h2>
                </div>

                <form onSubmit={handleAddOperation} className="profile-form">
                    <div className="form-group">
                        <label>Тип операции</label>
                        <select
                            name="type"
                            value={newOperation.type}
                            onChange={handleInputChange}
                            className="form-select"
                        >
                            <option value="expense">Расход</option>
                            <option value="income">Доход</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Сумма</label>
                        <input
                            type="number"
                            name="amount"
                            value={newOperation.amount}
                            onChange={handleInputChange}
                            placeholder="Введите сумму"
                            min="0"
                            step="0.01"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <div className="category-header">
                            <label>Категория</label>
                            <button
                                type="button"
                                className="add-category-btn"
                                onClick={handleOpenAddCategory}
                            >
                                + Добавить категорию
                            </button>
                        </div>
                        <select
                            name="category"
                            value={newOperation.category}
                            onChange={handleInputChange}
                            className="form-select"
                            required
                        >
                            <option value="">Выберите категорию</option>
                            {categories[newOperation.type].map(category => (
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
                            value={newOperation.description}
                            onChange={handleInputChange}
                            placeholder="Краткое описание операции"
                        />
                    </div>

                    <div className="form-group">
                        <label>Дата</label>
                        <input
                            type="date"
                            name="date"
                            value={newOperation.date}
                            onChange={handleInputChange}
                        />
                    </div>

                    <button type="submit" className="save-btn">
                        Добавить операцию
                    </button>
                </form>
            </section>

            {/* Секция фильтров и сортировки */}
            <section className="content-section">
                <div className="section-header">
                    <h2 className="section-title">
                        Операции ({filteredOperations.length})
                        <span className="results-count">из {operations.length}</span>
                    </h2>
                    <div className="controls-header">
                        <button
                            className={`filter-toggle-btn ${showFilters ? 'active' : ''}`}
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            🎛️ Фильтры {showFilters ? '▲' : '▼'}
                        </button>
                        <button
                            className="reset-filters-btn"
                            onClick={resetFilters}
                            disabled={!Object.values(filters).some(filter => filter !== "all" && filter !== "")}
                        >
                            Сбросить
                        </button>
                    </div>
                </div>

                {/* Панель фильтров */}
                {showFilters && (
                    <div className="filters-panel">
                        <div className="filters-grid">
                            <div className="form-group">
                                <label>Тип операции</label>
                                <select
                                    name="type"
                                    value={filters.type}
                                    onChange={handleFilterChange}
                                    className="form-select"
                                >
                                    <option value="all">Все типы</option>
                                    <option value="income">Доходы</option>
                                    <option value="expense">Расходы</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Категория</label>
                                <select
                                    name="category"
                                    value={filters.category}
                                    onChange={handleFilterChange}
                                    className="form-select"
                                >
                                    <option value="all">Все категории</option>
                                    {[...categories.expense, ...categories.income].map(category => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Дата от</label>
                                <input
                                    type="date"
                                    name="dateFrom"
                                    value={filters.dateFrom}
                                    onChange={handleFilterChange}
                                    className="form-select"
                                />
                            </div>

                            <div className="form-group">
                                <label>Дата до</label>
                                <input
                                    type="date"
                                    name="dateTo"
                                    value={filters.dateTo}
                                    onChange={handleFilterChange}
                                    className="form-select"
                                />
                            </div>

                            <div className="form-group">
                                <label>Сумма от</label>
                                <input
                                    type="number"
                                    name="amountFrom"
                                    value={filters.amountFrom}
                                    onChange={handleFilterChange}
                                    placeholder="0"
                                    min="0"
                                    step="0.01"
                                    className="form-select"
                                />
                            </div>

                            <div className="form-group">
                                <label>Сумма до</label>
                                <input
                                    type="number"
                                    name="amountTo"
                                    value={filters.amountTo}
                                    onChange={handleFilterChange}
                                    placeholder="∞"
                                    min="0"
                                    step="0.01"
                                    className="form-select"
                                />
                            </div>
                        </div>
                    </div>
                )}


                {/* Сортировка */}
                <div className="sorting-panel">
                    <span className="sort-label">Сортировка:</span>
                    <button
                        className={`sort-btn ${sortBy === 'date' ? 'active' : ''}`}
                        onClick={() => handleSortChange('date')}
                    >
                        Дата {getSortIcon('date')}
                    </button>
                    <button
                        className={`sort-btn ${sortBy === 'amount' ? 'active' : ''}`}
                        onClick={() => handleSortChange('amount')}
                    >
                        Сумма {getSortIcon('amount')}
                    </button>
                </div>
            </section>

            {/* Секция списка операций */}
            <section className="content-section">
                {filteredOperations.length === 0 ? (
                    <div className="empty-state">
                        <p>Нет операций, соответствующих выбранным фильтрам</p>
                        <button
                            className="primary-btn"
                            onClick={resetFilters}
                        >
                            Сбросить фильтры
                        </button>
                    </div>
                ) : (
                    <div className="operations-list">
                        {filteredOperations.map(operation => (
                            <div key={operation.id} className={`operation-item ${operation.type}`}>
                                <div className="operation-icon">
                                    {operation.type === 'income' ? '📈' : '📉'}
                                </div>
                                <div className="operation-content">
                                    <div className="operation-header">
                                        <span className="operation-category">
                                            {operation.category}
                                        </span>
                                        <span className={`operation-amount ${operation.type}`}>
                                            {operation.type === 'expense' ? '-' : '+'}{operation.amount} ₽
                                        </span>
                                    </div>
                                    {operation.description && (
                                        <p className="operation-description">
                                            {operation.description}
                                        </p>
                                    )}
                                    <div className="operation-footer">
                                        <span className="operation-date">
                                            {new Date(operation.date).toLocaleDateString('ru-RU')}
                                        </span>
                                        <span className="operation-type">
                                            {operation.type === 'income' ? 'Доход' : 'Расход'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Модальное окно добавления категории */}
            {showCustomCategoryModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h3>Добавить новую категорию</h3>
                            <button
                                className="close-btn"
                                onClick={() => setShowCustomCategoryModal(false)}
                            >
                                ×
                            </button>
                        </div>
                        <form onSubmit={handleAddCustomCategory} className="profile-form">
                            <div className="form-group">
                                <label>Тип категории</label>
                                <div className="category-type-display">
                                    {newOperation.type === 'expense' ? 'Расход' : 'Доход'}
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Название категории *</label>
                                <input
                                    type="text"
                                    value={customCategoryName}
                                    onChange={(e) => setCustomCategoryName(e.target.value)}
                                    placeholder="Введите название категории"
                                    required
                                />
                            </div>
                            <div className="modal-actions">
                                <button
                                    type="button"
                                    className="secondary-btn"
                                    onClick={() => setShowCustomCategoryModal(false)}
                                >
                                    Отмена
                                </button>
                                <button type="submit" className="primary-btn">
                                    Добавить категорию
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
};

export default Operation;