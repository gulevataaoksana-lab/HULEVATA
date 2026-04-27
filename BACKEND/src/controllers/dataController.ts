import { Request, Response, NextFunction } from 'express';
import * as service from '../services/dataService';
import { formatResponse, isEmpty } from '../utils/Utilities';
import { AppError } from '../errors/AppError';
import { Report } from '../models/Report';

export async function getReports(req: Request, res: Response, next: NextFunction) {
    try {
        let reports = (await service.getAllReports()) as Report[];
        const statusFilter = req.query.status_id as string;

        if (statusFilter) {
            reports = reports.filter((r) => r.status_id == Number(statusFilter));
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
        const id = Number(req.params.id);
        const result = await service.getReportById(id);

        if (!result || (Array.isArray(result) && result.length === 0)) {
            throw new AppError('Запис не знайдено', 404, 'NOT_FOUND');
        }

        const data = Array.isArray(result) ? result[0] : result;
        res.status(200).json(formatResponse(data, 'Запис знайдено'));
    } catch (error) {
        next(error);
    }
}

export async function exportReports(req: Request, res: Response, next: NextFunction) {
    try {
        const status_id = req.query.status_id ? Number(req.query.status_id) : undefined;
        const sort = req.query.sort as string;
        const limit = req.query.limit ? Number(req.query.limit) : undefined;
        const data = await service.exportReports({ status_id, sort, limit });

        res.status(200).json(formatResponse(data, 'Дані експортовано'));
    } catch (error) {
        next(error);
    }
}

export async function importReports(req: Request, res: Response, next: NextFunction) {
    try {
        const payload = req.body;

        if (!payload || !Array.isArray(payload.reports)) {
            throw new AppError('Поле reports має бути масивом', 400, 'VALIDATION_ERROR');
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
        const reporterId = body?.reporter_id || body?.reporter;

        if (!body || isEmpty(body.title) || isEmpty(body.severity) || isEmpty(reporterId)) {
            throw new AppError('Назва, критичність та автор обов\'язкові', 400, 'VALIDATION_ERROR');
        }

        // Приймаємо або status_id (число) або status (текст для сумісності)
        const statusId = body.status_id || body.status;
        if (!statusId) {
            throw new AppError('Статус обов\'язковий', 400, 'VALIDATION_ERROR');
        }

        body.reporter_id = reporterId;
        body.status_id = statusId;
        const report = await service.createReport(body);

        res.status(201).json(formatResponse(report, 'Запис створено'));
    } catch (error) {
        next(error);
    }
}

export async function updateReport(req: Request, res: Response, next: NextFunction) {
    try {
        const id = Number(req.params.id);
        
        
        if (req.body.status) {
            req.body.status_id = req.body.status_id || req.body.status;
        }

        const reporterId = req.body?.reporter_id || req.body?.reporter;
        if (reporterId) {
            req.body.reporter_id = reporterId;
        }

        const updated = await service.updateReport(id, req.body);
        if (!updated) throw new AppError('Не вдалося оновити', 404, 'NOT_FOUND');

        res.status(200).json(formatResponse(updated, 'Дані оновлено'));
    } catch (error) {
        next(error);
    }
}

export async function deleteReport(req: Request, res: Response, next: NextFunction) {
    try {
        const id = Number(req.params.id);
        const success = await service.deleteReport(id);
        if (!success) throw new AppError('Запис не знайдено', 404, 'NOT_FOUND');

        res.status(200).json(formatResponse(null, 'Запис видалено'));
    } catch (error) {
        next(error);
    }
}

export async function getUsers(req: Request, res: Response, next: NextFunction) {
    try {
        const data = await service.getAllUsers();

        res.status(200).json(formatResponse(data, 'Користувачі отримані'));
    } catch (error) {
        next(error);
    }
}



export async function getStats(req: Request, res: Response, next: NextFunction) {
    try {
        const data = await service.getStats();

        res.status(200).json(formatResponse(data, 'Статистика отримана'));
    } catch (error) {
        next(error);
    }
}

export async function searchUnsafe(req: Request, res: Response, next: NextFunction) {
    try {
        const title = req.query.title as string;
        const data = await service.searchReportsUnsafe(title);

        res.status(200).json(formatResponse(data, 'Результат пошуку (ненадійний)'));
    } catch (error) {
        next(error);
    }
}
