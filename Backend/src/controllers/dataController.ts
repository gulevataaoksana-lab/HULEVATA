﻿import { Request, Response, NextFunction } from 'express';
import * as service from '../services/dataService';
import { formatResponse, isEmpty } from '../utils/Utilities';
import { AppError } from '../errors/AppError';
import { CreateReportDto, UpdateReportDto } from '../models/Report';


export interface AuthRequest extends Request {
    user?: {
        id: string;
        name: string;
    };
}

export async function getReports(req: Request, res: Response, next: NextFunction) {
    try {
        let reports = await service.getAllReports();

        
        const statusFilter = req.query.status_id;
        if (statusFilter) {
            reports = reports.filter(r => r.status_id === Number(statusFilter));
        }

        
        const sortBy = req.query.sort as string;
        if (sortBy === 'title') {
            reports.sort((a, b) => a.title.localeCompare(b.title, 'uk'));
        }

        res.status(200).json(formatResponse(reports, 'Список звітів отримано'));
    } catch (error) {
        next(error);
    }
}

export async function getReportById(req: Request, res: Response, next: NextFunction) {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) throw new AppError("Некоректний ID", 400, 'INVALID_ID');

        const report = await service.getReportById(id);
        res.status(200).json(formatResponse(report, 'Звіт знайдено'));
    } catch (error) {
        next(error);
    }
}

export async function createReport(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const body: CreateReportDto = req.body;
        const user = req.user!; 

        if (isEmpty(body.title)) {
            throw new AppError("Назва звіту не може бути порожньою", 400, 'VALIDATION_ERROR');
        }

        const newReportDto = {
            ...body,
            reporter_id: user.id,
            authorName: user.name
        };

        const newReport = await service.createReport(newReportDto);
        res.status(201).json(formatResponse(newReport, 'Звіт успішно створено'));
    } catch (error) {
        next(error);
    }
}

export async function updateReport(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const id = Number(req.params.id);
        const body: UpdateReportDto = req.body;
        const user = req.user!; 

        if (isNaN(id)) throw new AppError("Некоректний ID для оновлення", 400, 'INVALID_ID');

        const updated = await service.updateReport(id, body, user.id);
        res.status(200).json(formatResponse(updated, 'Звіт оновлено'));
    } catch (error) {
        next(error);
    }
}

export async function deleteReport(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const id = Number(req.params.id);
        const user = req.user!;

        if (isNaN(id)) throw new AppError("Некоректний ID для видалення", 400, 'INVALID_ID');

        await service.deleteReport(id, user.id);
        res.status(200).json(formatResponse(null, 'Звіт видалено'));
    } catch (error) {
        next(error);
    }
}


export async function importReports(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const items: CreateReportDto[] = req.body;
        
        if (!Array.isArray(items)) {
            throw new AppError("Дані повинні бути масивом", 400, 'INVALID_FORMAT');
        }

        
        await service.importReports(items);

      
        res.status(201).json(formatResponse(null, `Імпортовано ${items.length} записів`));
    } catch (error) {
        next(error);
    }
}