INSERT OR IGNORE INTO users (id, name) VALUES 
('u1', 'Системний Адмін'), 
('u2', 'Аналітик');

INSERT OR IGNORE INTO statuses (name, description) VALUES
('Новий', 'Щойно створений запит'),
('В процесі', 'Запит обробляється'),
('Виправлено', 'Помилку усунено'),
('Відхилено', 'Не підтверджено ');


INSERT INTO reports (title, severity, status_id, description, reporter_id, createdAt) 
VALUES 
('Тестова помилка', 'Високий', 1, 'Початкові дані для перевірки API', 'u1', datetime('now'));