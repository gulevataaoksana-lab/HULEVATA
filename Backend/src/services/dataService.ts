import * as repo from '../repositories/dataRepository';
import * as userRepo from '../repositories/userRepository';
import { AppError } from '../errors/AppError';
import { Report, CreateReportDto, UpdateReportDto } from '../models/Report';

export async function getAllReports(): Promise<Report[]> {
    return await repo.getReportsWithAuthors();
}

export async function getReportById(id: number): Promise<Report> {
    const report = await repo.getById(id);
    if (!report) {
        throw new AppError("Звіт з таким ID не знайдено", 404, 'NOT_FOUND');
    }
    return report;
}

export async function createReport(data: CreateReportDto): Promise<Report> {
    const { title, severity, status_id, reporter_id, authorName, description } = data;

    if (!title || !reporter_id || !authorName) {
        throw new AppError("Назва, ID автора та ім'я є обов'язковими", 400, 'VALIDATION_ERROR');
    }

    
    const existingUser = await userRepo.getById(reporter_id);
    if (!existingUser) {
        await userRepo.add(reporter_id, authorName);
    }

    const newReport = {
        title,
        severity: severity || 'Низький',
        status_id: status_id || 1,
        description: description || '',
        reporter_id,
        createdAt: new Date().toISOString()
    };

    return await repo.add(newReport);
} 

export const importReports = async (data: any[]): Promise<void> => {
    for (const item of data) {
        
        await repo.add({
            ...item,
            createdAt: new Date().toISOString()
        });
    }
};

export async function updateReport(id: number, data: UpdateReportDto): Promise<Report> {
    const existing = await repo.getById(id);
    if (!existing) {
        throw new AppError("Звіт не знайдено ", 404, 'NOT_FOUND');
    }
    return await repo.update(id, data);
}

export async function deleteReport(id: number): Promise<void> {
    const result = await repo.remove(id);
    if (result.changes === 0) {
        throw new AppError("Не вдалося видалити звіт ", 404, 'DELETE_FAILED');
    }
}