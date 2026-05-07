import config from './config.js'; 
import { Report, User, Status, CreateReportDto } from './types.js';
import { httpClient } from './httpClient.js';

const API_URL = config.apiUrl;

export const ReportService = {
    getReports: () => httpClient<Report[]>(`${API_URL}/reports`),
    createReport: (dto: CreateReportDto) => httpClient<Report>(`${API_URL}/reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto)
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
    getUsers: () => httpClient<User[]>(`${API_URL}/users`)
};

export const StatusService = {
    getStatuses: () => httpClient<Status[]>(`${API_URL}/statuses`),
    createStatus: (name: string) => httpClient<Status>(`${API_URL}/statuses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
    }),
    deleteStatus: (id: string | number) => httpClient<void>(`${API_URL}/statuses/${id}`, {
        method: 'DELETE'
    })
};