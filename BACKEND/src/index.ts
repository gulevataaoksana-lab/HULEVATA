import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { runMigrations } from './db/dbClient';
import dataRouter from './routes/dataRoutes';
import statusRouter from './routes/statusRoutes';
import userRouter from './routes/userRoutes';
import logger from './middleware/logger';

const app = express();


app.use(cors({
    origin: 'http://localhost:5500', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());
app.use(logger);


app.use('/api/v1', dataRouter);         
app.use('/api/v1/statuses', statusRouter); 
app.use('/api/v1/users', userRouter);       

app.get('/', (req: Request, res: Response) => {
    res.send('Сервер АРІ v1 працює');
});


app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    
  
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        status: statusCode,
        title: statusCode === 500 ? 'Internal Server Error' : 'API Error',
        detail: err.message || 'Внутрішня помилка сервера',
        timestamp: new Date().toISOString()
    });
});

const port = Number(process.env.PORT || 3000);

runMigrations()
    .then(() => {
        app.listen(port, () => console.log(`Бекенд запущено: http://localhost:${port}/api/v1`));
    })
    .catch((err) => {
        console.error('Помилка міграції бази даних:', err);
    });