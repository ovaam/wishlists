# Как разместить сайт в интернете

## Вариант 1: Netlify Drop (САМЫЙ ПРОСТОЙ) ⭐

1. Откройте https://app.netlify.com/drop
2. Перетащите папку `newyear` на страницу
3. Получите ссылку вида: `https://random-name-123.netlify.app`
4. Готово! Сайт доступен по ссылке

## Вариант 2: GitHub Pages

1. Создайте репозиторий на GitHub (github.com)
2. Загрузите файлы в репозиторий:
   ```bash
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/ВАШ_ЛОГИН/newyear.git
   git push -u origin main
   ```
3. В настройках репозитория включите GitHub Pages
4. Сайт будет доступен по адресу: `https://ВАШ_ЛОГИН.github.io/newyear`

## Вариант 3: Vercel

1. Откройте https://vercel.com
2. Зарегистрируйтесь или войдите
3. Нажмите "Add New Project"
4. Перетащите папку `newyear` или подключите GitHub репозиторий
5. Получите ссылку вида: `https://newyear-xyz.vercel.app`

## Рекомендация

Используйте **Netlify Drop** - это самый быстрый способ без регистрации и настройки!

