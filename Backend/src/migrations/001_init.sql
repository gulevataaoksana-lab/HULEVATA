CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT 
);


CREATE TABLE IF NOT EXISTS statuses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT
);


CREATE TABLE IF NOT EXISTS reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('Низький', 'Середній', 'Високий', 'Критичний')),
    status_id INTEGER NOT NULL,
    description TEXT,
    authorName TEXT,
    reporter_id TEXT,
    createdAt DATETIME NOT NULL,
    FOREIGN KEY (status_id) REFERENCES statuses(id) ON DELETE RESTRICT,
    FOREIGN KEY (reporter_id) REFERENCES users(id) ON DELETE SET NULL
);