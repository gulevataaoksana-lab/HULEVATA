import { dbAll, dbRun } from '../db/dbClient';

export async function getAll() {
    return await dbAll('SELECT * FROM users');
}

export async function getById(id: string) {
    const sql = "SELECT * FROM users WHERE id = ?";
    return await dbAll(sql, [id]);
}

export async function add(id: string, name: string) {
    const sql = "INSERT INTO users (id, name) VALUES (?, ?)";
    const result = await dbRun(sql, [id, name]);
    return { 
        id: id, 
        name: name 
    };
}

export async function update(id: string, name: string) {
    const sql = "UPDATE users SET name = ? WHERE id = ?";
    await dbRun(sql, [name, id]);
    return { 
        id: id, 
        name: name 
    };
}

export async function remove(id: string) {
    const sql = "DELETE FROM users WHERE id = ?";
    await dbRun(sql, [id]);
    return true;
}