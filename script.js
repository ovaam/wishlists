// Данные вишлистов
let wishlists = {
    'леся': [],
    'мама': [],
    'алина': []
};

// Текущий выбранный пользователь (чей вишлист открыт)
let currentUser = null;

// Авторизованный пользователь
let authorizedUser = null;
const PASSWORDS = {
    'леся': 'lesik',
    'мама': 'lesikcool',
    'алина': 'lesikbest'
};

// Firebase конфигурация
const firebaseConfig = {
    apiKey: "AIzaSyB70EQaWcZWaEi9r70hZtq9c11CUHjDZbs",
    authDomain: "wishlist-8d5ee.firebaseapp.com",
    databaseURL: "https://wishlist-8d5ee-default-rtdb.europe-west1.firebasedatabase.app/",
    projectId: "wishlist-8d5ee",
    storageBucket: "wishlist-8d5ee.firebasestorage.app",
    messagingSenderId: "548837942324",
    appId: "1:548837942324:web:e462f7010f395d9d89d661",
    measurementId: "G-XYD7ERDPBS"
};

// Инициализация Firebase
let database = null;
try {
    if (typeof firebase !== 'undefined') {
        const app = firebase.initializeApp(firebaseConfig);
        database = firebase.database();
        console.log('Firebase подключен, данные синхронизируются');
        
        // Проверяем подключение
        database.ref('.info/connected').on('value', (snapshot) => {
            if (snapshot.val() === true) {
                console.log('Подключено к Firebase Realtime Database');
            } else {
                console.log('Не подключено к Firebase Realtime Database');
            }
        });
    } else {
        console.error('Firebase SDK не загружен! Проверьте подключение скриптов в index.html');
    }
} catch (e) {
    console.error('Ошибка инициализации Firebase:', e);
    console.log('Используется localStorage');
}

// Загрузка данных из Firebase или localStorage
function loadWishlists() {
    if (database) {
        // Загрузка из Firebase
        const wishlistsRef = database.ref('wishlists');
        wishlistsRef.on('value', (snapshot) => {
            const data = snapshot.val();
            console.log('Данные получены из Firebase:', data);
            
            // Инициализируем пустые массивы для всех пользователей
            const defaultWishlists = {
                'леся': [],
                'мама': [],
                'алина': []
            };
            
            if (data) {
                // Миграция данных
                Object.keys(data).forEach(user => {
                    let newKey = user;
                    if (user === 'я') newKey = 'леся';
                    if (user === 'сестра') newKey = 'алина';
                    
                    if (Array.isArray(data[user])) {
                        defaultWishlists[newKey] = data[user].map(item => {
                            if (typeof item === 'string') {
                                return { name: item, comment: '', owner: newKey, bookedBy: null };
                            }
                            if (!item.owner) item.owner = newKey;
                            if (item.bookedBy === undefined) item.bookedBy = null;
                            return item;
                        });
                    } else if (data[user]) {
                        defaultWishlists[newKey] = data[user];
                    }
                });
            }
            
            // Обновляем глобальный объект
            wishlists = defaultWishlists;
            
            // Если вишлист открыт, обновляем отображение
            if (currentUser) {
                renderWishlist();
            }
        }, (error) => {
            console.error('Ошибка загрузки из Firebase:', error);
            // Fallback на localStorage
            loadFromLocalStorage();
        });
    } else {
        // Загрузка из localStorage (fallback)
        loadFromLocalStorage();
    }
}

// Загрузка из localStorage
function loadFromLocalStorage() {
    const saved = localStorage.getItem('wishlists');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            Object.keys(parsed).forEach(user => {
                let newKey = user;
                if (user === 'я') newKey = 'леся';
                if (user === 'сестра') newKey = 'алина';
                
                if (Array.isArray(parsed[user])) {
                    wishlists[newKey] = parsed[user].map(item => {
                        if (typeof item === 'string') {
                            return { name: item, comment: '', owner: newKey, bookedBy: null };
                        }
                        if (!item.owner) item.owner = newKey;
                        if (item.bookedBy === undefined) item.bookedBy = null;
                        return item;
                    });
                }
            });
            // Если Firebase доступен, синхронизируем данные
            if (database) {
                saveWishlists();
            }
        } catch (e) {
            console.error('Ошибка загрузки данных:', e);
        }
    }
}

// Сохранение данных в Firebase или localStorage
function saveWishlists() {
    console.log('Сохранение данных:', wishlists);
    
    if (database) {
        // Сохранение в Firebase
        const wishlistsRef = database.ref('wishlists');
        wishlistsRef.set(wishlists)
            .then(() => {
                console.log('✅ Данные успешно сохранены в Firebase');
                console.log('Структура данных:', wishlists);
            })
            .catch((error) => {
                console.error('❌ Ошибка сохранения в Firebase:', error);
                console.error('Код ошибки:', error.code);
                console.error('Сообщение:', error.message);
                // Fallback на localStorage
                localStorage.setItem('wishlists', JSON.stringify(wishlists));
            });
    } else {
        console.log('Firebase не доступен, сохранение в localStorage');
        // Сохранение в localStorage (fallback)
        localStorage.setItem('wishlists', JSON.stringify(wishlists));
    }
}

// Загрузка авторизации
function loadAuth() {
    const saved = localStorage.getItem('authorizedUser');
    if (saved) {
        authorizedUser = saved;
        updateAuthStatus();
    }
}

// Сохранение авторизации
function saveAuth() {
    if (authorizedUser) {
        localStorage.setItem('authorizedUser', authorizedUser);
    } else {
        localStorage.removeItem('authorizedUser');
    }
    updateAuthStatus();
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Небольшая задержка для инициализации Firebase
    setTimeout(() => {
        loadWishlists();
        loadAuth();
        setupEventListeners();
        showHomeScreen();
        createSnowflakes();
    }, 100);
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
    document.getElementById('addBtn').addEventListener('click', () => {
        if (!authorizedUser) {
            showAuthModal();
        } else {
            addItem();
        }
    });

    // Enter в поле названия
    document.getElementById('itemNameInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!authorizedUser) {
                showAuthModal();
            } else {
                addItem();
            }
        }
    });

    // Авторизация
    document.getElementById('authSubmitBtn').addEventListener('click', handleAuth);
    document.getElementById('authCancelBtn').addEventListener('click', hideAuthModal);
    document.getElementById('authPasswordInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleAuth();
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

// Показать модальное окно авторизации
function showAuthModal() {
    document.getElementById('authModal').classList.add('active');
    document.getElementById('authNameInput').focus();
    document.getElementById('authError').textContent = '';
}

// Скрыть модальное окно авторизации
function hideAuthModal() {
    document.getElementById('authModal').classList.remove('active');
    document.getElementById('authNameInput').value = '';
    document.getElementById('authPasswordInput').value = '';
    document.getElementById('authError').textContent = '';
}

// Обработка авторизации
function handleAuth() {
    const name = document.getElementById('authNameInput').value;
    const password = document.getElementById('authPasswordInput').value;

    if (!name) {
        document.getElementById('authError').textContent = 'Выберите имя';
        return;
    }

    const correctPassword = PASSWORDS[name];
    if (!correctPassword || password !== correctPassword) {
        document.getElementById('authError').textContent = 'Неверный пароль';
        return;
    }

    authorizedUser = name;
    saveAuth();
    hideAuthModal();
    
    // Если была попытка добавить желание, добавляем его
    const nameInput = document.getElementById('itemNameInput');
    if (nameInput.value.trim()) {
        addItem();
    }
}

// Обновить статус авторизации
function updateAuthStatus() {
    const authStatus = document.getElementById('authStatus');
    if (authorizedUser) {
        const names = {
            'леся': 'Леся',
            'мама': 'Мама',
            'алина': 'Алина'
        };
        authStatus.innerHTML = `
            <span class="auth-user">Вы вошли как: ${names[authorizedUser]}</span>
            <button id="logoutBtn" class="logout-btn">Выйти</button>
        `;
        document.getElementById('logoutBtn').addEventListener('click', () => {
            authorizedUser = null;
            saveAuth();
        });
    } else {
        authStatus.innerHTML = '';
    }
}

// Добавление элемента в вишлист
function addItem() {
    if (!authorizedUser) {
        showAuthModal();
        return;
    }

    const nameInput = document.getElementById('itemNameInput');
    const commentInput = document.getElementById('itemCommentInput');
    
    const name = nameInput.value.trim();
    const comment = commentInput.value.trim();

    if (name === '') {
        nameInput.focus();
        return;
    }

    // Добавляем элемент в вишлист текущего пользователя
    if (!wishlists[currentUser]) {
        wishlists[currentUser] = [];
    }
    
    wishlists[currentUser].push({
        name: name,
        comment: comment,
        owner: currentUser,
        bookedBy: null
    });
    
    console.log('Добавлено желание для', currentUser, ':', wishlists[currentUser]);
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
    if (!authorizedUser) {
        showAuthModal();
        return;
    }

    const item = wishlists[currentUser][index];
    // Можно удалять только свои желания
    if (item.owner === authorizedUser) {
        wishlists[currentUser].splice(index, 1);
        saveWishlists();
        renderWishlist();
    } else {
        alert('Вы можете удалять только свои желания');
    }
}

// Бронирование желания
function bookItem(user, index) {
    if (!authorizedUser) {
        showAuthModal();
        return;
    }

    const item = wishlists[user][index];
    
    if (item.bookedBy === authorizedUser) {
        // Отменить бронирование
        item.bookedBy = null;
    } else if (!item.bookedBy) {
        // Забронировать
        item.bookedBy = authorizedUser;
    }
    
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

    wishlistElement.innerHTML = items.map((item, index) => {
        const isOwner = item.owner === authorizedUser;
        const isBooked = item.bookedBy !== null;
        const isBookedByMe = item.bookedBy === authorizedUser;
        const showBooking = authorizedUser && item.owner !== authorizedUser;
        // Статус бронирования виден только авторизованным пользователям, кроме владельца желания
        const showBookingStatus = authorizedUser && isBooked && item.owner !== authorizedUser;
        
        const names = {
            'леся': 'Леся',
            'мама': 'Мама',
            'алина': 'Алина'
        };

        return `
        <li class="wishlist-item ${showBookingStatus && isBooked ? 'booked' : ''}">
            <div class="wishlist-item-content">
                <h3 class="wishlist-item-name">${escapeHtml(item.name || item)}</h3>
                ${item.comment ? `<p class="wishlist-item-comment">${escapeHtml(item.comment)}</p>` : ''}
                ${showBookingStatus ? `<p class="booking-status">Забронировано: ${names[item.bookedBy]}</p>` : ''}
            </div>
            <div class="wishlist-item-actions">
                ${showBooking ? `
                    <button class="book-btn ${isBookedByMe ? 'booked' : ''}" onclick="bookItem('${currentUser}', ${index})">
                        ${isBookedByMe ? 'Отменить бронирование' : 'Забронировать'}
                    </button>
                ` : ''}
                ${isOwner ? `<button class="delete-btn" onclick="deleteItem(${index})">Удалить</button>` : ''}
            </div>
        </li>
        `;
    }).join('');
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

