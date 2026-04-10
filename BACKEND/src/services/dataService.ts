import * as repo from '../repositories/dataRepository';
import { AppError } from '../errors/AppError';
export async function getAllReports() {
    return await repo.getAll();
}
export async function getReportById(id: string) {
    return await repo.getById(id);
}
export async function createReport(data: any) {
    if (!data.status) {
        data.status = 'Новий';
    }
    if (!data.severity) {
        data.severity = 'Низький';
    }
    const reporter = data.reporter_id || data.reporter;
    if (reporter) {
        data.reporter_id = reporter;
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
export async function exportReports(options: { status?: string; sort?: string; limit?: number }) {
    return await repo.exportReports(options.status, options.sort, options.limit);
}
export async function importReports(items: any[]) {
    if (!Array.isArray(items)) {
        throw new AppError('reports має бути масивом', 400);
    }
    const imported: any[] = [];
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const reporter = item.reporter_id || item.reporter;
        if (!item.title || !item.severity || !item.status || !reporter) {
            throw new AppError(`Звіт на позиції ${i} некоректний: потрібні title, severity, status, reporter`, 400);
        }
        item.reporter_id = reporter;
        const created = await createReport(item);
        imported.push(created);
    }
    return imported;
}
export async function updateReport(id: string, data: any) {
    const existing = await repo.getById(id);
    if (!existing || (Array.isArray(existing) && existing.length === 0)) {
        return null;
    }
    return await repo.update(id, data);
}
export async function deleteReport(id: string) {
    return await repo.remove(id);
}
