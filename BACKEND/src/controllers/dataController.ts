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
        if (!body.title) {
            throw new AppError('Назва звіту (title) є обов’язковою', 400);
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
        const updated = service.updateReport(id, body);
        if (!updated) {
            throw new AppError('Звіт із таким ID не знайдено', 404);
        }
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
            throw new AppError('Неможливо видалити: звіт не знайдено', 404);
        }
        res.status(204).send();
    } catch (error) {
        next(error);
    }
}