import * as repo from '../repositories/dataRepository';
import { AppError } from '../errors/AppError';
import { Report } from '../models/Report';
export async function getAllReports() {
    return await repo.getAll();
}
export async function getReportById(id: number) {
    return await repo.getById(id);
}
export async function createReport(data: Partial<Report>) {
    if (!data.status_id) {
        data.status_id = 1;
    }
    if (!data.severity) {
        data.severity = 'Низький';
    }
    
    if (data.reporter_id) {
        const byId = await repo.getUserById(data.reporter_id);
        if (Array.isArray(byId) && byId.length > 0) {
            data.reporter_id = byId[0].id;
        } else {
            const byName = await repo.findUserByName(data.reporter_id);
            if (Array.isArray(byName) && byName.length > 0) {
                data.reporter_id = byName[0].id;
            } else {
                const created = await repo.createUser(data.reporter_id);
                data.reporter_id = created.id;
            }
        }
    }
    return await repo.add(data);
}
export async function exportReports(options: { status_id?: number; sort?: string; limit?: number }) {
    
    return await repo.exportReports(options.status_id, options.sort, options.limit);
}
export async function importReports(items: Partial<Report>[]) {
    if (!Array.isArray(items)) {
        throw new AppError('reports має бути масивом', 400);
    }
    const imported: Report[] = [];
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (!item.title || !item.severity || !item.status_id || !item.reporter_id) {
            throw new AppError(`Звіт на позиції ${i} некоректний: потрібні title, severity, status_id, reporter_id`, 400);
        }
        const created = await createReport(item);
        imported.push(created);
    }
    return imported;
}
export async function updateReport(id: number, data: Partial<Report>) {
    const existing = await repo.getById(id);
    if (!existing || (Array.isArray(existing) && existing.length === 0)) {
        return null;
    }
    return await repo.update(id, data);
}
export async function deleteReport(id: number) {
    return await repo.remove(id);
}
export async function getAllUsers() {
    return await repo.getAllUsers();
}
export async function getReportsFull(status_id?: number) {
    return await repo.getReportsWithAuthors(status_id);
}
export async function getStats() {
    return await repo.getStats();
}
export async function searchReportsUnsafe(title: string) {
    return await repo.searchReportsUnsafe(title);
}
