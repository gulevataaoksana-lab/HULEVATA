import * as repo from '../repositories/itemRepository';
export async function getAllItems() {
    return await repo.getAll();
}
export async function getItemById(id: string) {
    return await repo.getById(id);
}
export async function createItem(data: any) {
    return await repo.add(data);
}
export async function updateItem(id: string, data: any) {
    return await repo.update(id, data);
}
export async function deleteItem(id: string) {
    return await repo.remove(id);
}
