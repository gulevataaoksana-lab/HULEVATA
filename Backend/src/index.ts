import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { runMigrations } from './db/dbClient';
import dataRouter from './routes/dataRoutes';
import statusRouter from './routes/statusRoutes';
import userRouter from './routes/userRoutes';
import statisticsRouter from './routes/statisticsRoutes'; 
import authRouter from './routes/authRoutes';
import { AppError } from './errors/AppError';
import logger from './middleware/logger';

const app = express();

app.use(logger); 
app.use(cors({ 
    origin: ['http://localhost:5500', 'http://127.0.0.1:5500', 'http://localhost:3000'], 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'] 
}));

app.use(express.json());

app.use((_req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("Referrer-Policy", "no-referrer");
    next();
});

app.get('/', (_req, res) => res.send('API працює '));

app.use('/api/v1/reports', dataRouter);         
app.use('/api/v1/statuses', statusRouter); 
app.use('/api/v1/users', userRouter);
app.use('/api/v1/statistics', statisticsRouter);
app.use('/api/v1/auth', authRouter);
app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
    const statusCode = err instanceof AppError ? err.statusCode : 500;
    const isDev = process.env.NODE_ENV !== "production";

    console.error(`[ERROR] ${req.method} ${req.url} - ${err.message}`);

    res.status(statusCode).json({
        status: statusCode,
        error: err instanceof AppError ? err.message : 'Внутрішня помилка сервера',
        details: isDev ? String(err.message ?? err) : undefined,
        timestamp: new Date().toISOString()
    });
});

const PORT = 3000;
app.listen(PORT, async () => {
    try {
        await runMigrations();
        console.log(`Сервер запущено: http://localhost:${PORT}`);
    } catch (err) {
        console.error('Помилка міграцій:', err);
    }
});