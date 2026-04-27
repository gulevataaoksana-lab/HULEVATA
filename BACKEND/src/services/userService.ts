import * as userRepo from '../repositories/userRepository';

export async function getAllUsers() {
    return await userRepo.getAll();
}

export async function getUserById(id: string) {
    return await userRepo.getById(id);
}

export async function createUser(id: string, name: string) {
    return await userRepo.add(id, name);
}

export async function updateUser(id: string, name: string) {
    return await userRepo.update(id, name);
}

export async function deleteUser(id: string) {
    return await userRepo.remove(id);
}