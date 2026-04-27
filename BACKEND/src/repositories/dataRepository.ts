import { dbAll, dbRun } from '../db/dbClient';
import { Report } from '../models/Report';

export async function getAll() {
    return await dbAll('SELECT * FROM reports');
}
export async function add(data: Partial<Report>): Promise<Report> {
    const report = data as Report;
    const sql = `INSERT INTO reports (title, severity, status_id, description, reporter_id, createdAt) VALUES (?, ?, ?, ?, ?, ?)`;
    const params = [
        report.title,
        report.severity || 'Низький',
        report.status_id || 1,
        report.description || null,
        report.reporter_id || null,
        report.createdAt || new Date().toISOString()
    ];
    const result = await dbRun(sql, params);
    return {
        id: result.id,
        title: report.title,
        severity: report.severity || 'Низький',
        status_id: report.status_id || 1,
        description: report.description || null,
        reporter_id: report.reporter_id || null,
        createdAt: report.createdAt || new Date().toISOString()
    };
}
export async function update(id: number, data: Partial<Report>): Promise<Report> {
    const report = data as Report;
    const sql = `UPDATE reports SET title = ?, severity = ?, status_id = ?, description = ?, reporter_id = ? WHERE id = ?`;
    const params = [
        report.title,
        report.severity,
        report.status_id,
        report.description,
        report.reporter_id,
        id
    ];
    await dbRun(sql, params);
    return {
        id,
        title: report.title,
        severity: report.severity,
        status_id: report.status_id,
        description: report.description,
        reporter_id: report.reporter_id,
        createdAt: new Date().toISOString()
    };
}
export async function remove(id: number) {
    try {
        const sql = `DELETE FROM reports WHERE id = ?`;
        await dbRun(sql, [id]);
        return true;
    } catch (err) {
        return false;
    }
}
export async function getById(id: number) {
    const sql = `SELECT * FROM reports WHERE id = ?`;
    return await dbAll(sql, [id]);
}
export async function exportReports(status_id?: number, sort?: string, limit?: number): Promise<Report[]> {
    let sql = `SELECT r.*, u.name as authorName FROM reports r LEFT JOIN users u ON r.reporter_id = u.id`;
    const params: (string | number)[] = [];
    if (status_id) {
        sql += ` WHERE r.status_id = ?`;
        params.push(status_id);
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
export async function getAllUsers() {
    return await dbAll('SELECT * FROM users');
}
export async function getReportsWithAuthors(status_id?: number): Promise<Report[]> {
    let sql = `SELECT r.*, s.name as status_name, u.name as authorName 
               FROM reports r 
               LEFT JOIN statuses s ON r.status_id = s.id 
               LEFT JOIN users u ON r.reporter_id = u.id`;
    const params: (string | number)[] = [];
    if (status_id) {
        sql += ` WHERE r.status_id = ?`;
        params.push(status_id);
    }
    sql += ` ORDER BY r.createdAt DESC`;
    return await dbAll(sql, params);
}
export async function getStats() {
    return await dbAll('SELECT status_id, s.name as status_name, COUNT(*) as count FROM reports r LEFT JOIN statuses s ON r.status_id = s.id GROUP BY status_id');
}
export async function searchReportsUnsafe(title: string) {
    return await dbAll(`SELECT * FROM reports WHERE title = '${title}'`);
}
