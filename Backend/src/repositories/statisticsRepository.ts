import { dbAll } from '../db/dbClient';
import { Report } from '../models/Report';

export async function getAllReportsForStats() {
    return await dbAll<Report>(`SELECT severity, status_id FROM reports`, []);
}