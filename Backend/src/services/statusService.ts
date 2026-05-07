import * as statusRepo from '../repositories/statusRepository';
import { AppError } from '../errors/AppError';

export async function getAllStatuses() {
    return await statusRepo.getAll();
}

export async function getStatusById(id: number) {
    const status = await statusRepo.getById(id);
    if (!status) throw new AppError("Статус не знайдено", 404);
    return status;
}

export async function createStatus(name: string, description?: string) {
    if (!name) throw new AppError("Назва статусу обов'язкова", 400);
    return await statusRepo.add(name, description);
}

export async function updateStatus(id: number, name: string, description?: string | null) {
    const exists = await statusRepo.getById(id);
    if (!exists) throw new AppError("Статус не знайдено", 404);
    return await statusRepo.update(id, name, description);
}

export async function deleteStatus(id: number) {
    const result = await statusRepo.remove(id);
    if (result.changes === 0) throw new AppError("Статус не знайдено", 404);
    return { message: "Статус видалено" };
}