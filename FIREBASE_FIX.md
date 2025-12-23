# Решение проблемы подключения к Firebase

## Проблема: Не удалось подключиться к Firebase

### Шаг 1: Проверьте, что Realtime Database создан

1. Откройте https://console.firebase.google.com
2. Выберите проект **wishlist-8d5ee**
3. В меню слева найдите **Realtime Database**
4. Если его нет:
   - Нажмите "Create Database"
   - Выберите регион (ближайший к вам, например: us-central1)
   - Выберите режим: **"Start in test mode"**
   - Нажмите "Enable"

### Шаг 2: Проверьте правильный databaseURL

1. В Firebase Console → Realtime Database
2. Вверху должна быть ссылка вида: `https://wishlist-8d5ee-default-rtdb.firebaseio.com/`
3. Убедитесь, что в коде используется именно этот URL

### Шаг 3: Настройте правила безопасности

1. Realtime Database → **Rules**
2. Установите правила:
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```
3. Нажмите **"Publish"**

### Шаг 4: Проверьте, что база данных активна

1. Realtime Database → **Data**
2. Должна быть пустая структура (или с данными)
3. Если видите ошибку - база данных не создана

### Шаг 5: Проверьте настройки проекта

1. Project Settings (шестеренка) → **General**
2. Убедитесь, что проект активен
3. Проверьте, что Realtime Database включен

---

## Альтернативное решение

Если Realtime Database не работает, можно использовать **Firestore**:

1. В Firebase Console создайте **Firestore Database**
2. Начните в тестовом режиме
3. Установите правила:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

Но для этого нужно будет изменить код (использовать Firestore вместо Realtime Database).

---

## Быстрая проверка

Откройте в браузере:
```
https://wishlist-8d5ee-default-rtdb.firebaseio.com/.json
```

Если видите `null` или `{}` - база данных работает, но пустая.
Если видите ошибку - база данных не создана или правила блокируют доступ.


