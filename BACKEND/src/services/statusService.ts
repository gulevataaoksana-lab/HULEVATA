import * as repo from '../repositories/statusRepository';
export async function getAllStatuses() {
    return await repo.getAll();
}
export async function getStatusById(id: string) {
    return await repo.getById(id);
}
export async function createStatus(name: string) {
    return await repo.add(name);
}
export async function updateStatus(id: string, name: string) {
    return await repo.update(id, name);
}
export async function deleteStatus(id: string) {
    return await repo.remove(id);
}
