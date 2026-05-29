import { dbAll } from '../db/dbClient';
import { Report } from '../models/Report';

export async function getAllReportsForStats() {
    return await dbAll<Report>(`SELECT severity, status_id FROM reports`, []);
}

export async function getStatusRatio(statusId: number): Promise<number> {
    const sql = `
        SELECT 
            (SELECT COUNT(*) FROM reports WHERE status_id = ?) * 1.0 / 
            NULLIF((SELECT COUNT(*) FROM reports), 0) as ratio
    `;
    const result = await dbAll<{ ratio: number }>(sql, [statusId]);
    
    return result[0].ratio || 0;
}