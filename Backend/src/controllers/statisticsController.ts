import { Request, Response, NextFunction } from 'express';
import * as service from '../services/statisticsService';
import { formatResponse } from '../utils/Utilities';
import { IStatisticsRequest } from '../models/Statistics';
import { AppError } from '../errors/AppError';

export async function getReportStats(req: Request<{}, IStatisticsRequest>, res: Response, next: NextFunction) {
    try {
        console.log(`[INFO] Запит статистики: ${req.method} ${req.url}`);

        const { severity, statusId } = req.body; 
        
        const data = await service.getCalculatedStats(severity, statusId);
        
        res.status(200).json(formatResponse(data, 'Статистику отримано'));
    } catch (error) {
        next(error);
    }
}

export async function getAverageReportsCount(req: Request, res: Response, next: NextFunction) {
    try {
        console.log(`[INFO] Запит частки статусу: ${req.method} ${req.url}`);

        const statusId = Number(req.query.statusId);
        
        if (isNaN(statusId)) {
            throw new AppError("Не вказано коректний ID статусу", 400);
        }

        const average = await service.getStatusRatio(statusId);
        
        res.status(200).json(formatResponse({ average }, 'Розрахунок виконано'));
    } catch (error) {
        next(error);
    }
}