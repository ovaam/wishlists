# Развертывание на Firebase Hosting (опционально)

## ⚠️ Важно
Firebase CLI нужен **только для хостинга** сайта через Firebase Hosting. 

**Для синхронизации данных (Realtime Database) CLI не нужен** - это уже работает!

Вы можете использовать:
- ✅ **Netlify** (самый простой) - просто перетащите папку
- ✅ **GitHub Pages** - загрузите файлы в репозиторий
- ✅ **Firebase Hosting** (если хотите всё в одном месте)

---

## Если хотите использовать Firebase Hosting:

### Шаг 1: Установить Firebase CLI

```bash
npm install -g firebase-tools
```

Если не работает, попробуйте:
```bash
sudo npm install -g firebase-tools
```

### Шаг 2: Войти в Firebase

```bash
firebase login
```

Откроется браузер для авторизации.

### Шаг 3: Инициализировать проект

```bash
cd /Users/ovaam/Desktop/newyear
firebase init hosting
```

Выберите:
- Use an existing project → выберите `wishlist-8d5ee`
- Public directory: `.` (текущая папка)
- Single-page app: `No`
- Set up automatic builds: `No`

### Шаг 4: Развернуть

```bash
firebase deploy --only hosting
```

Сайт будет доступен по адресу: `https://wishlist-8d5ee.web.app`

---

## Рекомендация

**Используйте Netlify** - это проще:
1. Откройте https://app.netlify.com/drop
2. Перетащите папку `newyear`
3. Готово!

Синхронизация данных через Firebase Realtime Database будет работать на любом хостинге.

