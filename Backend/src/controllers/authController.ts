import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import * as userRepo from '../repositories/userRepository';
import { AppError } from '../errors/AppError';

const SECRET_KEY = "super_secret_key_variant_6";

export async function login(req: Request, res: Response, next: NextFunction) {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) throw new AppError("Введіть логін та пароль", 400);

        const user = await userRepo.getById(username);
        if (!user) {
            throw new AppError("Користувача не знайдено", 401);
        }

        if (password !== "qwerty") {
            throw new AppError("Неправильний пароль", 401);
        }

        const token = jwt.sign({ id: user.id, name: user.name }, SECRET_KEY, { expiresIn: '1h' });
        res.status(200).json({ success: true, token, user: { id: user.id, name: user.name } });
    } catch (err) {
        next(err);
    }
}