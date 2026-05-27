import { dbAll, dbRun } from '../db/dbClient';
import { Status } from '../models/Status'; 

export async function getAll(): Promise<Status[]> {
    return await dbAll<Status>('SELECT * FROM statuses');
}

export async function getById(id: number): Promise<Status | null> {
    const rows = await dbAll<Status>('SELECT * FROM statuses WHERE id = ?', [id]);
    return rows[0] || null;
}

export async function add(name: string, description?: string): Promise<Status> {
    const sql = `INSERT INTO statuses (name, description) VALUES (?, ?)`;
    const result = await dbRun(sql, [name, description || '']);
    return { id: result.id, name, description: description || null };
}

export async function update(id: number, name: string, description?: string | null): Promise<Status> {
    const sql = `UPDATE statuses SET name = ?, description = ? WHERE id = ?`;
    const result = await dbRun(sql, [name, description || '', id]);
    if (result.changes === 0) throw new Error("Статус не знайдено для оновлення");
    return { id, name, description: description || null };
}

export async function remove(id: number): Promise<{ id: number; changes: number }> {
    const result = await dbRun(`DELETE FROM statuses WHERE id = ?`, [id]);
    return { id, changes: result.changes };
}