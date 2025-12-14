// Данные вишлистов
let wishlists = {
    'леся': [],
    'мама': [],
    'алина': []
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
            // Также мигрируем старые ключи 'я' -> 'леся' и 'сестра' -> 'алина'
            Object.keys(parsed).forEach(user => {
                let newKey = user;
                if (user === 'я') newKey = 'леся';
                if (user === 'сестра') newKey = 'алина';
                
                if (Array.isArray(parsed[user])) {
                    wishlists[newKey] = parsed[user].map(item => {
                        if (typeof item === 'string') {
                            return { name: item, comment: '' };
                        }
                        return item;
                    });
                }
            });
            // Сохраняем мигрированные данные
            saveWishlists();
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
    createSnowflakes();
});

// Настройка обработчиков событий
function setupEventListeners() {
    // Клики по кнопкам имен
    document.querySelectorAll('.name-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const user = btn.dataset.user;
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
        'леся': 'Вишлист Леси',
        'мама': 'Вишлист мамы',
        'алина': 'Вишлист Алины'
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

// Создание анимации снежинок
function createSnowflakes() {
    const snowContainer = document.querySelector('.snow-container');
    if (!snowContainer) return;

    // Создаем 50 снежинок
    for (let i = 0; i < 50; i++) {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        snowflake.innerHTML = '❄';
        
        // Случайная позиция и размер
        const size = Math.random() * 20 + 10;
        const startX = Math.random() * 100;
        const duration = Math.random() * 10 + 10;
        const delay = Math.random() * 5;
        const drift = (Math.random() - 0.5) * 100;
        
        snowflake.style.cssText = `
            position: absolute;
            left: ${startX}%;
            top: -20px;
            font-size: ${size}px;
            color: #888;
            opacity: ${Math.random() * 0.5 + 0.5};
            animation: snowFall ${duration}s linear infinite;
            animation-delay: ${delay}s;
            pointer-events: none;
            z-index: 1000;
        `;
        
        // Добавляем keyframes для движения
        if (!document.getElementById('snowAnimation')) {
            const style = document.createElement('style');
            style.id = 'snowAnimation';
            style.textContent = `
                @keyframes snowFall {
                    0% {
                        transform: translateY(0) translateX(0) rotate(0deg);
                    }
                    100% {
                        transform: translateY(100vh) translateX(${drift}px) rotate(360deg);
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        snowContainer.appendChild(snowflake);
    }
}

