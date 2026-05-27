import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../errors/AppError';

declare global {
    namespace Express {
        interface Request {
            user?: { id: string; name: string };
        }
    }
}

const SECRET_KEY = "super_secret_key_variant_6"; 

export const authMiddleware = (req: Request, _res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AppError("Для доступу потрібна авторизація.", 401, "UNAUTHORIZED");
        }

        const token = authHeader.split(' ')[1];
        
        const decoded = jwt.verify(token, SECRET_KEY) as { id: string; name: string };
        
        req.user = decoded; 
        next();
    } catch (error) {
        next(new AppError("Потрібен повторний вхід.", 401, "UNAUTHORIZED"));
    }
};