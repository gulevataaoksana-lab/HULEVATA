import { dbAll, dbRun } from '../db/dbClient';

export async function getAll() {
    return await dbAll('SELECT * FROM statuses');
}

export async function getById(id: string) {
    const sql = "SELECT * FROM statuses WHERE id = ?";
    return await dbAll(sql, [id]);
}

export async function add(name: string, description?: string) {
    const sql = "INSERT INTO statuses (name, description) VALUES (?, ?)";
    const result = await dbRun(sql, [name, description || null]);
    
    return { 
        id: result.id, 
        name: name,
        description: description || null
    };
}

export async function update(id: string, name: string, description?: string | null) {
    let sql: string;
    let params: any[];

    if (description !== undefined) {
        sql = "UPDATE statuses SET name = ?, description = ? WHERE id = ?";
        params = [name, description, id];
    } else {
        sql = "UPDATE statuses SET name = ? WHERE id = ?";
        params = [name, id];
    }

    await dbRun(sql, params);
    return { 
        id: id, 
        name: name,
        description: description || null
    };
}

export async function remove(id: string) {
    const sql = "DELETE FROM statuses WHERE id = ?";
    await dbRun(sql, [id]);
    return true;
}