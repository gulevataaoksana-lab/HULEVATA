Як запустити проєкт
1. Встановити залежності: `npm install`
2. Запустити сервер у режимі розробки: `npm run dev`
3. Сервер автоматично підніметься на `http://localhost:3000`

Робота з базою даних
Файл бази даних створюється автоматично у папці `./data` під ім'ям `database.db`.
Папка `./data` створюється при першому запуску, якщо її ще немає.

Схема БД
База даних містить три доменні таблиці та таблицю для міграцій.

Таблиця users (Користувачі):
- id: TEXT PRIMARY KEY
- name: TEXT NOT NULL UNIQUE

Таблиця statuses (Статуси):
- id: INTEGER PRIMARY KEY AUTOINCREMENT
- name: TEXT NOT NULL UNIQUE
- description: TEXT

Таблиця reports (Звіти):
- id: INTEGER PRIMARY KEY AUTOINCREMENT
- title: TEXT NOT NULL
- severity: TEXT NOT NULL CHECK (severity IN ('Низький', 'Середній', 'Високий', 'Критичний'))
- status: TEXT NOT NULL CHECK (status IN ('Новий', 'У процесі', 'Виправлено', 'Відхилено'))
- description: TEXT
- reporter_id: TEXT
- createdAt: DATETIME NOT NULL
- FOREIGN KEY(reporter_id) REFERENCES users(id) ON DELETE SET NULL

Зв'язки та обмеження:
- Користувачі пов'язані з звітами через `reporter_id` (1:N).
- `users.name` та `statuses.name` мають UNIQUE.
- `reports.title`, `reports.severity`, `reports.status`, `reports.createdAt` є NOT NULL.
- Для `reports` додано CHECK для `severity` та `status`.

Приклади запитів (API Endpoints)
Отримання всіх звітів з фільтром статусу:
`GET /api/reports?status=У процесі`
Повний список із JOIN на авторів:
`GET /api/reports-full`
Агрегація за статусом:
`GET /api/stats`
Створення звіту:
`POST /api/reports`
Тіло запиту: `{"title":"Помилка авторизації","severity":"Високий","status":"Новий","description":"Тест","reporter_id":"u1"}`
Отримати звіт за ID:
`GET /api/reports/1`

Експорт звітів у JSON:
`GET /api/reports/export`
`GET /api/reports/export?status=У процесі&limit=10&sort=createdAtAsc`

Імпорт звітів з JSON:
`POST /api/reports/import`
Тіло запиту: `{"reports": [{"title":"Помилка авторизації","severity":"Високий","status":"Новий","description":"Тест","reporter":"Оксана"}]}`

Статуси (CRUD):
`GET /api/statuses`
`GET /api/statuses/1`
`POST /api/statuses`
`PUT /api/statuses/1`
`DELETE /api/statuses/1`

Демонстрація SQL Injection
У проєкті спеціально залишено ендпоїнт `/api/search-unsafe`, який використовує пряму конкатенацію рядка в SQL-запит.
Це небезпечно, бо користувач може передати ін’єкцію, наприклад:
`http://localhost:3000/api/search-unsafe?title=1' OR '1'='1`
Запит перетвориться на `SELECT * FROM reports WHERE title = '1' OR '1'='1'`, і сервер поверне всі записи.

Де знаходиться .db
Файл SQLite зберігається у `./data/database.db`.