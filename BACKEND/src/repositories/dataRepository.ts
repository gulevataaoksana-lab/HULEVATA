import { dbAll, dbRun } from '../db/dbClient';
export async function getAll() {
    return await dbAll('SELECT * FROM reports');
}
export async function add(data: any) {
    const sql = `INSERT INTO reports (title, severity, status, description, reporter_id, createdAt) VALUES (?, ?, ?, ?, ?, ?)`;
    const params = [
        data.title,
        data.severity || 'Низький',
        data.status || 'Новий',
        data.description || null,
        data.reporter_id || null,
        data.createdAt || new Date().toISOString()
    ];
    const result = await dbRun(sql, params);
    return {
        id: result.id,
        title: data.title,
        severity: data.severity || 'Низький',
        status: data.status || 'Новий',
        description: data.description || null,
        reporter_id: data.reporter_id || null,
        createdAt: data.createdAt || new Date().toISOString()
    };
}
export async function update(id: string, data: any) {
    const sql = `UPDATE reports SET title = ?, severity = ?, status = ?, description = ?, reporter_id = ? WHERE id = ?`;
    const params = [
        data.title,
        data.severity,
        data.status,
        data.description,
        data.reporter_id,
        id
    ];
    await dbRun(sql, params);
    return {
        id,
        title: data.title,
        severity: data.severity,
        status: data.status,
        description: data.description,
        reporter_id: data.reporter_id
    };
}
export async function remove(id: string) {
    try {
        const sql = `DELETE FROM reports WHERE id = ?`;
        await dbRun(sql, [id]);
        return true;
    } catch (err) {
        return false;
    }
}
export async function getById(id: string) {
    const sql = `SELECT * FROM reports WHERE id = ?`;
    return await dbAll(sql, [id]);
}
export async function exportReports(status?: string, sort?: string, limit?: number) {
    let sql = `SELECT r.*, u.name as authorName FROM reports r LEFT JOIN users u ON r.reporter_id = u.id`;
    const params: any[] = [];
    if (status) {
        sql += ` WHERE r.status = ?`;
        params.push(status);
    }
    if (sort === 'createdAtAsc') {
        sql += ` ORDER BY r.createdAt ASC`;
    } else if (sort === 'titleAsc') {
        sql += ` ORDER BY r.title ASC`;
    } else if (sort === 'titleDesc') {
        sql += ` ORDER BY r.title DESC`;
    } else {
        sql += ` ORDER BY r.createdAt DESC`;
    }
    if (limit) {
        sql += ` LIMIT ?`;
        params.push(limit);
    }
    return await dbAll(sql, params);
}
export async function getUserById(id: string) {
    const sql = `SELECT * FROM users WHERE id = ?`;
    return await dbAll(sql, [id]);
}
export async function findUserByName(name: string) {
    const sql = `SELECT * FROM users WHERE name = ?`;
    return await dbAll(sql, [name]);
}
export async function createUser(name: string) {
    const id = `u${Date.now()}`;
    const sql = `INSERT INTO users (id, name) VALUES (?, ?)`;
    await dbRun(sql, [id, name]);
    return { id, name };
}
