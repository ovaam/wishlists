// Данные вишлистов
let wishlists = {
    'я': [],
    'мама': [],
    'сестра': []
};

// Текущий выбранный пользователь
let currentUser = 'я';

// Загрузка данных из localStorage
function loadWishlists() {
    const saved = localStorage.getItem('wishlists');
    if (saved) {
        wishlists = JSON.parse(saved);
    }
}

// Сохранение данных в localStorage
function saveWishlists() {
    localStorage.setItem('wishlists', JSON.stringify(wishlists));
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    loadWishlists();
    setupEventListeners();
    renderWishlist();
});

// Настройка обработчиков событий
function setupEventListeners() {
    // Кнопки выбора пользователя
    document.querySelectorAll('.user-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const user = btn.dataset.user;
            switchUser(user);
        });
    });

    // Кнопка добавления
    document.getElementById('addBtn').addEventListener('click', addItem);

    // Enter в поле ввода
    document.getElementById('itemInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addItem();
        }
    });
}

// Переключение пользователя
function switchUser(user) {
    currentUser = user;
    
    // Обновление активной кнопки
    document.querySelectorAll('.user-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.user === user) {
            btn.classList.add('active');
        }
    });

    // Обновление заголовка
    const titles = {
        'я': 'Мой вишлист',
        'мама': 'Вишлист мамы',
        'сестра': 'Вишлист сестры'
    };
    document.getElementById('currentUserTitle').textContent = titles[user];

    // Очистка поля ввода
    document.getElementById('itemInput').value = '';

    // Отображение вишлиста
    renderWishlist();
}

// Добавление элемента в вишлист
function addItem() {
    const input = document.getElementById('itemInput');
    const itemText = input.value.trim();

    if (itemText === '') {
        return;
    }

    // Добавляем элемент в вишлист текущего пользователя
    wishlists[currentUser].push(itemText);
    saveWishlists();

    // Очищаем поле ввода
    input.value = '';

    // Обновляем отображение
    renderWishlist();
}

// Удаление элемента из вишлиста
function deleteItem(index) {
    wishlists[currentUser].splice(index, 1);
    saveWishlists();
    renderWishlist();
}

// Отображение вишлиста
function renderWishlist() {
    const wishlistElement = document.getElementById('wishlist');
    const items = wishlists[currentUser] || [];

    if (items.length === 0) {
        wishlistElement.innerHTML = '<li class="empty-state">Вишлист пуст. Добавьте первое желание!</li>';
        return;
    }

    wishlistElement.innerHTML = items.map((item, index) => `
        <li class="wishlist-item">
            <span class="wishlist-item-text">${escapeHtml(item)}</span>
            <button class="delete-btn" onclick="deleteItem(${index})">Удалить</button>
        </li>
    `).join('');
}

// Экранирование HTML для безопасности
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

