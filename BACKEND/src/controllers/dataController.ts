import { Request, Response, NextFunction } from 'express';
import * as service from '../services/dataService';
import { CreateReportDto, UpdateReportDto } from '../dtos/Report';
import { AppError } from '../errors/AppError';
export function getReports(req: Request, res: Response, next: NextFunction) {
    try {
        const reports = service.getAllReports();
        res.status(200).json(reports);
    } catch (error) {
        next(error);
    }
}
export function createReport(req: Request, res: Response, next: NextFunction) {
    try {
        const body: CreateReportDto = req.body;
        if (!body || Object.keys(body).length === 0) {
            throw new AppError('Тіло запиту порожнє (Invalid JSON)', 400);
        }
        if (!body.title || body.title.length < 3) {
            throw new AppError('Назва звіту (title) обов’язкова і має бути не менше 3 символів', 400);
        }
        if (!body.severity) {
            throw new AppError('Рівень критичності (severity) обов’язковий', 400);
        }
        if (!body.status) {
            throw new AppError('Статус обов’язковий', 400);
        }
        if (!body.reporter) {
            throw new AppError('Автор звіту (reporter) обов’язковий', 400);
        }
        const report = service.createReport(body);
        res.status(201).json(report);
    } catch (error) {
        next(error);
    }
}
export function updateReport(req: Request, res: Response, next: NextFunction) {
    try {
        const id = req.params.id as string;
        const body: UpdateReportDto = req.body;
        const existingReport = service.getAllReports().find(r => r.id === id);
        if (!existingReport) {
            throw new AppError(`Ресурс із ID ${id} не знайдено`, 404);
        }
        if (body.title && body.title.length < 3) {
            throw new AppError('Нова назва занадто коротка', 400);
        }
        const updated = service.updateReport(id, body);
        res.status(200).json(updated);
    } catch (error) {
        next(error);
    }
}
export function deleteReport(req: Request, res: Response, next: NextFunction) {
    try {
        const id = req.params.id as string;
        const success = service.deleteReport(id);
        if (!success) {
            throw new AppError('Помилка видалення: об’єкт не знайдено за вказаним ID', 404);
        }
        res.status(204).send();
    } catch (error) {
        next(error);
    }
}