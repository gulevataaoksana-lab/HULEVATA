import { Request, Response, NextFunction } from 'express';
import * as service from '../services/statisticsService';
import { formatResponse } from '../utils/Utilities';
import { IStatisticsRequest } from '../models/Statistics';

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