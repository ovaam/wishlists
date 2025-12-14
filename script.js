// Данные вишлистов
let wishlists = {
    'я': [],
    'мама': [],
    'сестра': []
};

// Текущий выбранный пользователь
let currentUser = null;

// Загрузка данных из localStorage
function loadWishlists() {
    const saved = localStorage.getItem('wishlists');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            // Миграция старых данных (если были строки, преобразуем в объекты)
            Object.keys(parsed).forEach(user => {
                if (Array.isArray(parsed[user])) {
                    wishlists[user] = parsed[user].map(item => {
                        if (typeof item === 'string') {
                            return { name: item, comment: '' };
                        }
                        return item;
                    });
                }
            });
        } catch (e) {
            console.error('Ошибка загрузки данных:', e);
        }
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
    showHomeScreen();
});

// Настройка обработчиков событий
function setupEventListeners() {
    // Клики по аватарам
    document.querySelectorAll('.avatar-card').forEach(card => {
        card.addEventListener('click', () => {
            const user = card.dataset.user;
            openWishlist(user);
        });
    });

    // Кнопка "Назад"
    document.getElementById('backBtn').addEventListener('click', showHomeScreen);

    // Кнопка добавления
    document.getElementById('addBtn').addEventListener('click', addItem);

    // Enter в поле названия
    document.getElementById('itemNameInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            addItem();
        }
    });
}

// Показать главный экран
function showHomeScreen() {
    document.getElementById('homeScreen').classList.add('active');
    document.getElementById('wishlistScreen').classList.remove('active');
    currentUser = null;
}

// Открыть вишлист пользователя
function openWishlist(user) {
    currentUser = user;
    
    // Обновление заголовка
    const titles = {
        'я': 'Мой вишлист',
        'мама': 'Вишлист мамы',
        'сестра': 'Вишлист сестры'
    };
    document.getElementById('currentUserTitle').textContent = titles[user];

    // Очистка полей ввода
    document.getElementById('itemNameInput').value = '';
    document.getElementById('itemCommentInput').value = '';

    // Переключение экранов
    document.getElementById('homeScreen').classList.remove('active');
    document.getElementById('wishlistScreen').classList.add('active');

    // Отображение вишлиста
    renderWishlist();
}

// Добавление элемента в вишлист
function addItem() {
    const nameInput = document.getElementById('itemNameInput');
    const commentInput = document.getElementById('itemCommentInput');
    
    const name = nameInput.value.trim();
    const comment = commentInput.value.trim();

    if (name === '') {
        nameInput.focus();
        return;
    }

    // Добавляем элемент в вишлист текущего пользователя
    wishlists[currentUser].push({
        name: name,
        comment: comment
    });
    saveWishlists();

    // Очищаем поля ввода
    nameInput.value = '';
    commentInput.value = '';
    nameInput.focus();

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
            <div class="wishlist-item-content">
                <h3 class="wishlist-item-name">${escapeHtml(item.name || item)}</h3>
                ${item.comment ? `<p class="wishlist-item-comment">${escapeHtml(item.comment)}</p>` : ''}
            </div>
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

