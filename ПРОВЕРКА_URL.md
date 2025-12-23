# Как найти правильный URL базы данных Firebase

## Проблема: Неправильный URL базы данных

Firebase говорит, что URL базы данных настроен неправильно.

## Решение: Найти правильный URL

### Шаг 1: Откройте Firebase Console

1. Перейдите на https://console.firebase.google.com
2. Выберите проект **wishlist-8d5ee**
3. Откройте **Realtime Database**

### Шаг 2: Найдите правильный URL

1. В разделе Realtime Database → **Data**
2. Вверху страницы должен быть URL базы данных
3. Он может быть одним из вариантов:
   - `https://wishlist-8d5ee-default-rtdb.firebaseio.com/`
   - `https://wishlist-8d5ee-default-rtdb.europe-west1.firebasedatabase.app/`
   - `https://wishlist-8d5ee-default-rtdb.asia-southeast1.firebasedatabase.app/`
   - Или другой, в зависимости от региона

### Шаг 3: Скопируйте правильный URL

Скопируйте **полный URL** из Firebase Console.

### Шаг 4: Обновите код

Нужно обновить `databaseURL` в файле `script.js` на правильный URL.

---

## Альтернативный способ найти URL

1. Project Settings (шестеренка) → **General**
2. Прокрутите вниз до "Your apps"
3. Найдите ваше веб-приложение
4. В конфигурации должен быть `databaseURL`

---

## Важно

URL зависит от региона, где создана база данных:
- `us-central1` → `.firebaseio.com`
- Другие регионы → `.firebasedatabase.app`


