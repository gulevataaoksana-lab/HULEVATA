INSERT OR IGNORE INTO users (id, name) VALUES ('u1', 'Оксана'), ('u2', 'Адмін');
INSERT OR IGNORE INTO statuses (name, description) VALUES
    ('Новий', 'Очікує підтвердження'),
    ('У процесі', 'Звіт розглядається'),
    ('Виправлено', 'Проблему вирішено'),
    ('Відхилено', 'Звіт відхилено');
INSERT INTO reports (title, severity, status, description, reporter_id, createdAt) 
VALUES ('Помилка входу', 'Високий', 'У процесі', 'Не працює логін', 'u1', datetime('now'));
INSERT INTO reports (title, severity, status, description, reporter_id, createdAt) 
VALUES ('Загроза', 'Середній', 'Новий', 'Загроза викрадення даних', 'u1', datetime('now'));
INSERT INTO reports (title, severity, status, description, reporter_id, createdAt) 
VALUES ('Помилка', 'Критичний', 'Відхилено', 'Помилка', 'u2', datetime('now'));