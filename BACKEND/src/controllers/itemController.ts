import { Request, Response, NextFunction } from 'express';
import { dbAll, dbRun } from '../db/dbClient'; 
import { formatResponse, isEmpty } from '../utils/Utilities';
import { AppError } from '../errors/AppError';
export async function getReports(req: Request, res: Response, next: NextFunction) {
    try {
        const status = req.query.status;
        const sort = req.query.sort;
        let reports = await dbAll("SELECT * FROM reports") as any[];
        if (status) {
            reports = reports.filter(function(r) {
                return r.status === status;
            });
        }
        if (sort === 'title') {
            reports = reports.sort(function(a, b) {
                return a.title.localeCompare(b.title, 'uk');
            });
        }
        res.status(200).json(formatResponse(reports, 'Список звітів отримано'));
    } catch (error) {
        next(error);
    }
}
export async function getReportById(req: Request, res: Response, next: NextFunction) {
    try {
        const id = req.params.id;
        const result = await dbAll("SELECT * FROM reports WHERE id = " + id) as any[];       
        if (!result || result.length === 0) {
            throw new AppError('Звіт не знайдено', 404);
        }
        res.status(200).json(formatResponse(result[0], 'Звіт знайдено'));
    } catch (error) {
        next(error);
    }
}
export async function createReport(req: Request, res: Response, next: NextFunction) {
    try {
        const { title, severity, status, description, reporter } = req.body;
        if (isEmpty(title) || isEmpty(severity) || isEmpty(reporter)) {
            throw new AppError('Поля назва, критичність та автор обов’язкові', 400);
        }
        const now = new Date().toISOString();
        const sql = "INSERT INTO reports (title, severity, status, description, reporter, createdAt) VALUES ('" + 
                    title + "', '" + severity + "', '" + status + "', '" + description + "', '" + reporter + "', '" + now + "')";
        const result = await dbRun(sql) as any;
        const newReport = { id: result.id, title, severity, status, description, reporter, createdAt: now };

        res.status(201).json(formatResponse(newReport, 'Звіт створено'));
    } catch (error) {
        next(error);
    }
}
export async function updateReport(req: Request, res: Response, next: NextFunction) {
    try {
        const id = req.params.id;
        const { title, severity, status, description, reporter } = req.body;

        if (title !== undefined && isEmpty(title)) {
            throw new AppError('Назва не може бути порожньою', 400);
        }
        const sql = "UPDATE reports SET title='" + title + "', severity='" + severity + "', status='" + status + 
                    "', description='" + description + "', reporter='" + reporter + "' WHERE id=" + id;
        await dbRun(sql);
        res.status(200).json(formatResponse({ id: Number(id), title }, 'Звіт оновлено'));
    } catch (error) {
        next(error);
    }
}
export async function deleteReport(req: Request, res: Response, next: NextFunction) {
    try {
        const id = req.params.id;
        const check = await dbAll("SELECT id FROM reports WHERE id = " + id) as any[];
        if (check.length === 0) {
            throw new AppError('Звіт не знайдено для видалення', 404);
        }
        await dbRun("DELETE FROM reports WHERE id = " + id);
        res.status(200).json(formatResponse(null, 'Звіт видалено'));
    } catch (error) {
        next(error);
    }
}
