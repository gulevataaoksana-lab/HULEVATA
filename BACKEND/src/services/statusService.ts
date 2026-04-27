import * as repo from '../repositories/statusRepository';
export async function getAllStatuses() {
    return await repo.getAll();
}
export async function getStatusById(id: string) {
    return await repo.getById(id);
}
export async function createStatus(name: string, description?: string) {
    return await repo.add(name, description);
}
export async function updateStatus(id: string, name: string, description?: string | null) {
    return await repo.update(id, name, description);
}
export async function deleteStatus(id: string) {
    return await repo.remove(id);
}
