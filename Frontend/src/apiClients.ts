import config from './config.js'; 
import { Report, User, Status, CreateReportDto } from './types.js';
import { httpClient } from './httpClient.js';

const API_URL = config.apiUrl;

export interface ISeverityStat {
    severity: string;
    count: number;
    status_id: number;
}

export const ReportService = {
    getReports: (searchQuery?: string) => {
        const url = searchQuery 
            ? `${API_URL}/reports?search=${encodeURIComponent(searchQuery)}` 
            : `${API_URL}/reports`;
        return httpClient<Report[]>(url);
    },
    createReport: (dto: CreateReportDto) => httpClient<Report>(`${API_URL}/reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto)
    }),
    getStatsAfterPost: (severity: string, statusId: string) => 
        httpClient<ISeverityStat[]>(`${API_URL}/statistics/report`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ severity, statusId }) 
        }),
    updateReport: (id: string | number, dto: Partial<CreateReportDto>) => httpClient<Report>(`${API_URL}/reports/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto)
    }),
    deleteReport: (id: string | number) => httpClient<void>(`${API_URL}/reports/${id}`, {
        method: 'DELETE'
    })
};

export const UserService = {
    getUsers: () => httpClient<User[]>(`${API_URL}/users`),
    deleteUser: (id: string | number) => httpClient<void>(`${API_URL}/users/${id}`, {
        method: 'DELETE'
    })
};

export const StatusService = {
    getStatuses: () => httpClient<Status[]>(`${API_URL}/statuses`),
    deleteStatus: (id: string | number) => httpClient<void>(`${API_URL}/statuses/${id}`, {
        method: 'DELETE'
    })
};

export const StatisticsService = {
    getReportStats: async (severity: string, statusId: string) => {
        return await httpClient<ISeverityStat[]>(`${API_URL}/statistics/report`, {
            method: 'POST',
            body: JSON.stringify({ severity, statusId })
        });
    }
};