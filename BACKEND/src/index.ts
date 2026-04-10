import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { runMigrations, dbAll, db } from './db/dbClient';
import reportRouter from './routes/dataRoutes';
import statusRouter from './routes/statusRoutes';
const app = express();
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
    if (req.method === 'POST' || req.method === 'PUT') {
        console.log('Дані, що прийшли:', req.body);
    }
    next();
});
db.run("PRAGMA foreign_keys = ON");
app.use('/api/reports', reportRouter);
app.use('/api/statuses', statusRouter);
app.get('/', (req: Request, res: Response) => {
    res.send('Сервер працює — доступні маршрути: /api/reports, /api/users');
});
app.get('/api/users', async function(req: Request, res: Response, next: NextFunction) {
    try {
        const data = await dbAll("SELECT * FROM users");
        res.status(200).json({ data });
    } catch (error) {
        next(error);
    }
});
app.get('/api/reports-full', async function(req: Request, res: Response, next: NextFunction) {
    try {
        const statusFilter = req.query.status ? `WHERE r.status = ?` : '';
        const params = req.query.status ? [req.query.status] : [];
        const sql = `
            SELECT r.*, u.name as authorName 
            FROM reports r 
            LEFT JOIN users u ON r.reporter_id = u.id 
            ${statusFilter}
            ORDER BY r.createdAt DESC 
            LIMIT 50
        `;
        const data = await dbAll(sql, params);
        res.status(200).json({ data, meta: { total: data.length, limit: 50 } });
    } catch (error) { 
        next(error); 
    }
});
app.get('/api/stats', async function(req: Request, res: Response, next: NextFunction) {
    try {
        const data = await dbAll("SELECT status, COUNT(*) as count FROM reports GROUP BY status");
        res.status(200).json({ data, meta: { timestamp: new Date().toISOString() } });
    } catch (error) { 
        next(error); 
    }
});
app.get('/api/search-unsafe', async function(req: Request, res: Response, next: NextFunction) {
    try {
        const title = req.query.title as string;
        const data = await dbAll("SELECT * FROM reports WHERE title = '" + title + "'");
        res.status(200).json({ data, warning: "Vulnerable to SQLi" });
    } catch (error) { 
        next(error); 
    }
});
app.use(function(err: any, req: Request, res: Response, next: NextFunction) {
    console.error("ПОМИЛКА НА СЕРВЕРІ");
    console.error("Повідомлення:", err.message);
    if (err.code) console.error("Код помилки бд:", err.code);
    let status = err.statusCode || 500;
    let message = err.message || "Внутрішня помилка сервера";
    if (err.code === 'SQLITE_CONSTRAINT') {
        status = 409;
        message = "Помилка зв'язків бази (FOREIGN KEY). Перевір, чи існує такий ID автора!";
    }
    if (message.includes('UNIQUE')) {
        status = 409;
        message = "Такий запис уже існує";
    }
    res.status(status).json({
        status: 'помилка',
        code: status,
        message: message
    });
});
const port = Number(process.env.PORT || 3000);
runMigrations().then(function() {
    app.listen(port, function() {
        console.log(`Сервер запущено на http://localhost:${port}`);
    });
}).catch(function(err) {
    console.error("Помилка ініціалізації: ", err);
});
