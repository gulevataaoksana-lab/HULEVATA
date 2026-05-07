import * as userRepo from '../repositories/userRepository';
import { AppError } from '../errors/AppError'; 

export async function getAllUsers() {
    return await userRepo.getAll();
}

export async function getUserById(id: string) {
    const user = await userRepo.getById(id);
    if (!user) throw new AppError(`Користувача з ID ${id} не знайдено`, 404, 'NOT_FOUND');
    return user;
}

export async function createUser(id: string, name: string) {
    if (!id || !name) throw new AppError("ID та ім'я користувача обов'язкові", 400, 'VALIDATION_ERROR');
    
    const existing = await userRepo.getById(id);
    if (existing) throw new AppError("Користувач з таким ID вже існує", 409, 'CONFLICT');

    return await userRepo.add(id, name);
}

export async function updateUser(id: string, name: string) {
    const user = await userRepo.getById(id);
    if (!user) throw new AppError("Користувача не знайдено ", 404, 'NOT_FOUND');
    
    return await userRepo.update(id, name);
}

export async function deleteUser(id: string) {
    const isDeleted = await userRepo.remove(id);
    
    if (!isDeleted) {
        throw new AppError("Користувача не знайдено для видалення", 404, 'DELETE_FAILED');
    }
    
    return { message: "Користувача видалено" };
}