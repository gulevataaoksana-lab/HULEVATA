import { Request, Response, NextFunction } from 'express';
import * as service from '../services/dataService';
import { formatResponse, isEmpty } from '../utils/Utilities';
import { AppError } from '../errors/AppError';
export async function getReports(req: Request, res: Response, next: NextFunction) {
    try { 
        let reports = await service.getAllReports() as any[]; 
        const statusFilter = req.query.status as string;
        if (statusFilter) {
            reports = reports.filter((r) => r.status === statusFilter);
        }
        const sortBy = req.query.sort as string;
        if (sortBy === 'title') {
            reports = reports.sort((a, b) => a.title.localeCompare(b.title, 'uk'));
        }
        res.status(200).json(formatResponse(reports, 'Список успішно отримано'));
    } catch (error) {
        next(error);
    }
}
export async function getReportById(req: Request, res: Response, next: NextFunction) {
    try {
        const id = req.params.id;
        const result = await service.getReportById(id);
        if (!result || (Array.isArray(result) && result.length === 0)) {
            throw new AppError('Запис не знайдено', 404);
        }
        const data = Array.isArray(result) ? result[0] : result;
        res.status(200).json(formatResponse(data, 'Запис знайдено'));
    } catch (error) {
        next(error);
    }
}
export async function exportReports(req: Request, res: Response, next: NextFunction) {
    try {
        const status = req.query.status as string;
        const sort = req.query.sort as string;
        const limit = req.query.limit ? Number(req.query.limit) : undefined;
        const data = await service.exportReports({ status, sort, limit });
        res.status(200).json(formatResponse(data, 'Дані експортовано'));
    } catch (error) {
        next(error);
    }
}
export async function importReports(req: Request, res: Response, next: NextFunction) {
    try {
        const payload = req.body;
        if (!payload || !Array.isArray(payload.reports)) {
            throw new AppError('Поле reports має бути масивом', 400);
        }
        const result = await service.importReports(payload.reports);
        res.status(201).json(formatResponse(result, 'Дані імпортовано'));
    } catch (error) {
        next(error);
    }
}
export async function createReport(req: Request, res: Response, next: NextFunction) {
    try {
        const body = req.body;
        const validStatuses = ['Новий', 'У процесі', 'Виправлено', 'Відхилено'];
        const reporterId = body?.reporter_id || body?.reporter;
        if (!body || isEmpty(body.title) || isEmpty(body.severity) || isEmpty(reporterId)) {
            throw new AppError('Назва, критичність та автор обов’язкові', 400);
        }
        if (!body.status || !validStatuses.includes(body.status)) {
            throw new AppError('Неправильний статус звіту', 400);
        }
        body.reporter_id = reporterId;
        const report = await service.createReport(body);
        res.status(201).json(formatResponse(report, 'Запис створено'));
    } catch (error) {
        next(error);
    }
}
export async function updateReport(req: Request, res: Response, next: NextFunction) {
    try {
        const id = req.params.id;
        const validStatuses = ['Новий', 'У процесі', 'Виправлено', 'Відхилено'];
        if (req.body.status && !validStatuses.includes(req.body.status)) {
            throw new AppError('Неправильний статус звіту', 400);
        }
        const reporterId = req.body?.reporter_id || req.body?.reporter;
        if (reporterId) {
            req.body.reporter_id = reporterId;
        }
        const updated = await service.updateReport(id, req.body);
        if (!updated) throw new AppError('Не вдалося оновити', 404);
        res.status(200).json(formatResponse(updated, 'Дані оновлено'));
    } catch (error) {
        next(error);
    }
}
export async function deleteReport(req: Request, res: Response, next: NextFunction) {
    try {
        const success = await service.deleteReport(req.params.id);
        if (!success) throw new AppError('Запис не знайдено', 404);
        res.status(200).json(formatResponse(null, 'Запис видалено'));
    } catch (error) {
        next(error);
    }
}
