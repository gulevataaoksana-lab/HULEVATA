import { dbAll, dbRun } from '../db/dbClient';
import { Report, UpdateReportDto } from '../models/Report';


export async function getReportsWithAuthors(): Promise<Report[]> {
    const sql = `
        SELECT r.*, s.name as status_name, u.name as authorName 
        FROM reports r 
        LEFT JOIN statuses s ON r.status_id = s.id 
        LEFT JOIN users u ON r.reporter_id = u.id
        ORDER BY r.createdAt DESC`;
   
    return await dbAll<Report>(sql);
}


export async function getById(id: number): Promise<Report | null> {
    const sql = 'SELECT * FROM reports WHERE id = ?';
    const rows = await dbAll<Report>(sql, [id]);
    return rows.length > 0 ? rows[0] : null;
}


export async function add(r: Partial<Report>): Promise<Report> {
    const createdAt = r.createdAt || new Date().toISOString();
    const sql = `
        INSERT INTO reports (title, severity, status_id, description, reporter_id, createdAt) 
        VALUES (?, ?, ?, ?, ?, ?)`;
    
    const params = [
        r.title || '', 
        r.severity || 'Низький', 
        r.status_id || 1, 
        r.description || null, 
        r.reporter_id || null, 
        createdAt
    ];

   
    const result = await dbRun(sql, params);

    return { 
        id: result.id, 
        title: r.title || '', 
        severity: r.severity || 'Низький', 
        status_id: r.status_id || 1, 
        description: r.description || null,
        reporter_id: r.reporter_id || null,
        createdAt: createdAt
    } as Report;
}


export async function update(id: number, data: UpdateReportDto): Promise<Report> {
    const current = await getById(id);
    if (!current) throw new Error("Report not found");

    const fields = Object.keys(data).filter(key => (data as any)[key] !== undefined);
    if (fields.length === 0) return current;

    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const params = fields.map(field => (data as any)[field]);
    params.push(id);

    await dbRun(`UPDATE reports SET ${setClause} WHERE id = ?`, params);
    
    return { ...current, ...data } as Report;
}


export async function remove(id: number): Promise<{ id: number; changes: number }> {
    return await dbRun('DELETE FROM reports WHERE id = ?', [id]);
}