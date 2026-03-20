import express from 'express';
import cors from 'cors';
import dataRoutes from './routes/dataRoutes'; 
import { AppError } from './errors/AppError'; 
const app = express();
app.use(cors()); 
app.use(express.json());
app.use(function(req, res, next) {
    console.log(req.method + ' ' + req.url);
    next();
});
app.use('/api/reports', dataRoutes); 
let users: any[] = [];
app.get('/api/users', function(req, res) {
    res.json(users);
});
app.post('/api/users', function(req, res) {
    const { name } = req.body;
    let user = users.find(u => u.name === name);
    if (!user) {
        user = { id: Date.now().toString(), name: name, role: "User" };
        users.push(user);
    }
    res.status(201).json(user);
});
app.use(function(err: any, req: any, res: any, next: any) {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            message: err.message,
            statusCode: err.statusCode
        });
    }
    console.error(err);
    res.status(500).json({ 
        message: "Internal Server Error",
        statusCode: 500 
    });
});
const PORT = 3000;
app.listen(PORT, function() {
    console.log(`Сервер працює: http://localhost:${PORT}`);
});