import { Request, Response, NextFunction } from 'express';
import * as service from '../services/userService';
import { formatResponse, isEmpty } from '../utils/Utilities';
import { AppError } from '../errors/AppError';

export async function getUsers(req: Request, res: Response, next: NextFunction) {
    try {
        const users = await service.getAllUsers();
        res.status(200).json(formatResponse(users, 'Список користувачів отримано'));
    } catch (error) {
        next(error);
    }
}

export async function getUserById(req: Request, res: Response, next: NextFunction) {
    try {
        const id = req.params.id;
        const result = await service.getUserById(id);
        if (!result || (Array.isArray(result) && result.length === 0)) {
            throw new AppError('Користувача не знайдено', 404);
        }
        const data = Array.isArray(result) ? result[0] : result;
        res.status(200).json(formatResponse(data, 'Користувача знайдено'));
    } catch (error) {
        next(error);
    }
}

export async function createUser(req: Request, res: Response, next: NextFunction) {
    try {
        const id = req.body.id;
        const name = req.body.name;
        
        if (isEmpty(id)) {
            throw new AppError('ID користувача обов\'язковий', 400);
        }
        if (isEmpty(name)) {
            throw new AppError('Ім\'я користувача обов\'язкове', 400);
        }
        
        const newUser = await service.createUser(id, name);
        res.status(201).json(formatResponse(newUser, 'Користувача створено'));
    } catch (error) {
        next(error);
    }
}

export async function updateUser(req: Request, res: Response, next: NextFunction) {
    try {
        const id = req.params.id;
        const name = req.body.name;
        
        if (isEmpty(name)) {
            throw new AppError('Ім\'я не може бути порожнім', 400);
        }
        
        const updated = await service.updateUser(id, name);
        res.status(200).json(formatResponse(updated, 'Користувача оновлено'));
    } catch (error) {
        next(error);
    }
}

export async function deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
        const id = req.params.id;
        await service.deleteUser(id);
        res.status(200).json(formatResponse(null, 'Користувача видалено'));
    } catch (error) {
        next(error);
    }
}