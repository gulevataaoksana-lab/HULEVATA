import { dbAll, dbRun } from '../db/dbClient';

export interface User {
    id: string;
    name: string;
}

export async function getAll(): Promise<User[]> {
    return await dbAll<User>('SELECT * FROM users');
}

export async function getById(id: string): Promise<User | null> {
    const rows = await dbAll<User>('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0] || null;
}

export async function add(id: string, name: string): Promise<User> {
    await dbRun('INSERT INTO users (id, name) VALUES (?, ?)', [id, name]);
    return { id, name };
}

export async function update(id: string, name: string): Promise<User> {
    await dbRun('UPDATE users SET name = ? WHERE id = ?', [name, id]);
    return { id, name };
}

export async function remove(id: string): Promise<boolean> {
    const result = await dbRun('DELETE FROM users WHERE id = ?', [id]);
    return result.changes > 0;
}