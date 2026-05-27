import { Request, Response, NextFunction } from 'express';
import * as service from '../services/userService';
import { formatResponse } from '../utils/Utilities';
import { User, CreateUserDto } from '../models/User'; 

export async function getUsers(_req: Request, res: Response, next: NextFunction) {
    try {
        const users: User[] = await service.getAllUsers();
        res.status(200).json(formatResponse(users, 'Користувачів отримано'));
    } catch (error) {
        next(error);
    }
}

export async function getUserById(req: Request<{ id: string }>, res: Response, next: NextFunction) {
    try {
        const user = await service.getUserById(req.params.id);
        res.status(200).json(formatResponse(user, 'Користувача знайдено'));
    } catch (error) {
        next(error);
    }
}

export async function createUser(req: Request<{}, any, CreateUserDto>, res: Response, next: NextFunction) {
    try {
        const { id, name } = req.body; 
        const newUser = await service.createUser(id, name);
        res.status(201).json(formatResponse(newUser, 'Користувача створено'));
    } catch (error) {
        next(error);
    }
}

export async function updateUser(req: Request<{ id: string }, any, { name: string }>, res: Response,next: NextFunction) {
    try {
        const updated = await service.updateUser(req.params.id, req.body.name);
        res.status(200).json(formatResponse(updated, 'Користувача оновлено'));
    } catch (error) {
        next(error);
    }
}

export async function deleteUser(req: Request<{ id: string }>, res: Response, next: NextFunction) {
    try {
        await service.deleteUser(req.params.id);
        res.status(200).json(formatResponse(null, 'Користувача видалено'));
    } catch (error) {
        next(error);
    }
}