import express from 'express';
import cors from 'cors';
import dataRoutes from './routes/dataRoutes'; 
const app = express();
app.use(cors()); 
app.use(express.json());
app.use('/api/reports', dataRoutes); 
let users: any[] = [];
app.get('/api/users', (req, res) => {
    res.json(users);
});
app.post('/api/users', (req, res) => {
    const { name } = req.body;
    let user = users.find(u => u.name === name);
    if (!user) {
        user = { id: Date.now().toString(), name: name, role: "User" };
        users.push(user);
    }
    res.status(201).json(user);
});
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Сервер: http://localhost:${PORT}`);
});