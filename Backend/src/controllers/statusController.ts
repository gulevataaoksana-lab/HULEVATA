import { Request, Response, NextFunction } from 'express';
import * as service from '../services/statusService';
import { formatResponse } from '../utils/Utilities';

export async function getStatuses(_req: Request, res: Response, next: NextFunction) {
    try {
        const statuses = await service.getAllStatuses();
        res.status(200).json(formatResponse(statuses, 'Статуси отримано'));
    } catch (error) {
        next(error);
    }
}

export async function getStatusById(req: Request, res: Response, next: NextFunction) {
    try {
        const status = await service.getStatusById(Number(req.params.id));
        res.status(200).json(formatResponse(status, 'Статус знайдено'));
    } catch (error) {
        next(error);
    }
}

export async function createStatus(req: Request, res: Response, next: NextFunction) {
    try {
        const { name, description } = req.body;
        const newStatus = await service.createStatus(name, description);
        res.status(201).json(formatResponse(newStatus, 'Статус створено'));
    } catch (error) {
        next(error);
    }
}

export async function updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
        const updated = await service.updateStatus(Number(req.params.id), req.body.name, req.body.description);
        res.status(200).json(formatResponse(updated, 'Статус оновлено'));
    } catch (error) {
        next(error);
    }
}

export async function deleteStatus(req: Request, res: Response, next: NextFunction) {
    try {
        await service.deleteStatus(Number(req.params.id));
        res.status(200).json(formatResponse(null, 'Статус видалено'));
    } catch (error) {
        next(error);
    }
}