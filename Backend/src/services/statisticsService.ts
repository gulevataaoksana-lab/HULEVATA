import * as repo from '../repositories/statisticsRepository';
import { ISeverityStat } from '../models/Statistics';

export async function getCalculatedStats(severity: string, statusId: string): Promise<ISeverityStat[]> { 
    const allReports = await repo.getAllReportsForStats() ; 
    const filtered = allReports.filter(r => 
        r.severity === severity && String(r.status_id) === String(statusId)
    );

    return [{
        severity,
        status_id: Number(statusId),
        count: filtered.length 
    }];
}

export async function getStatusRatio(statusId: number): Promise<number> {
    return await repo.getStatusRatio(statusId);
}