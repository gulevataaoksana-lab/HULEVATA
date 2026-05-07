import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { runMigrations } from './db/dbClient';
import dataRouter from './routes/dataRoutes';
import statusRouter from './routes/statusRoutes';
import userRouter from './routes/userRoutes';
import { AppError } from './errors/AppError';
import logger from './middleware/./logger';

const app = express();
app.use(logger); 

app.use(cors({ 
    origin: ['http://localhost:5500', 'http://127.0.0.1:5500'], 

    methods: ['GET', 'POST', 'PUT', 'DELETE'] 
}));
app.use(express.json());

app.use('/api/v1/reports', dataRouter);         
app.use('/api/v1/statuses', statusRouter); 
app.use('/api/v1/users', userRouter);

app.get('/', (req, res) => res.send('API працює '));


app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err instanceof AppError ? err.statusCode : 500;
    const errorCode = err instanceof AppError ? err.code : 'INTERNAL_SERVER_ERROR';

    console.error(`[ERROR] ${req.method} ${req.url} - ${err.message}`);

    res.status(statusCode).json({
        status: statusCode,
        title: errorCode,
        detail: err.message || 'Внутрішня помилка сервера',
        instance: req.url, 
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