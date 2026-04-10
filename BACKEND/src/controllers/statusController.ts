import { Request, Response, NextFunction } from 'express';
import * as service from '../services/statusService';
import { formatResponse, isEmpty } from '../utils/Utilities';
import { AppError } from '../errors/AppError';
export async function getStatuses(req: Request, res: Response, next: NextFunction) {
    try {
        const statuses = await service.getAllStatuses();
        res.status(200).json(formatResponse(statuses, 'Список статусів отримано'));
    } catch (error) {
        next(error);
    }
}
export async function getStatusById(req: Request, res: Response, next: NextFunction) {
    try {
        const id = req.params.id;
        const result = await service.getStatusById(id);
        if (!result || (Array.isArray(result) && result.length === 0)) {
            throw new AppError('Статус не знайдено', 404);
        }
        const data = Array.isArray(result) ? result[0] : result;
        res.status(200).json(formatResponse(data, 'Статус знайдено'));
    } catch (error) {
        next(error);
    }
}
export async function createStatus(req: Request, res: Response, next: NextFunction) {
    try {
        const name = req.body.name;
        if (isEmpty(name)) {
            throw new AppError('Назва статусу обов’язкова', 400);
        }
        const newStatus = await service.createStatus(name);
        res.status(201).json(formatResponse(newStatus, 'Статус створено'));
    } catch (error) {
        next(error);
    }
}
export async function updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
        const id = req.params.id;
        const name = req.body.name;  
        if (isEmpty(name)) {
            throw new AppError('Нова назва не може бути порожньою', 400);
        }
        const updated = await service.updateStatus(id, name);
        res.status(200).json(formatResponse(updated, 'Статус оновлено'));
    } catch (error) {
        next(error);
    }
}
export async function deleteStatus(req: Request, res: Response, next: NextFunction) {
    try {
        const id = req.params.id;
        await service.deleteStatus(id);
        res.status(200).json(formatResponse(null, 'Статус видалено'));
    } catch (error) {
        next(error);
    }
}
