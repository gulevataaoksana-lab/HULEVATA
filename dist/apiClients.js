import config from './config.js';
import { httpClient } from './httpClient.js';
const API_URL = config.apiUrl;
export const ReportService = {
    getReports: () => httpClient(`${API_URL}/reports`),
    createReport: (dto) => httpClient(`${API_URL}/reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto)
    }),
    updateReport: (id, dto) => httpClient(`${API_URL}/reports/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto)
    }),
    deleteReport: (id) => httpClient(`${API_URL}/reports/${id}`, {
        method: 'DELETE'
    })
};
export const UserService = {
    getUsers: () => httpClient(`${API_URL}/users`)
};
export const StatusService = {
    getStatuses: () => httpClient(`${API_URL}/statuses`),
    createStatus: (name) => httpClient(`${API_URL}/statuses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
    }),
    deleteStatus: (id) => httpClient(`${API_URL}/statuses/${id}`, {
        method: 'DELETE'
    })
};
