import config from './config.js';
const API_URL = config.apiUrl;
const REQUEST_TIMEOUT = 10000;
async function apiFetch(url, options = {}) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal,
        });
        clearTimeout(id);
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorMessage = errorData.message || `Помилка: ${response.status}`;
            if (response.status === 400)
                throw new Error(`Невалідні дані: ${errorMessage}`);
            if (response.status === 404)
                throw new Error("Ресурс не знайдено");
            if (response.status >= 500)
                throw new Error("Помилка на сервері");
            throw new Error(errorMessage);
        }
        if (response.status === 204)
            return {};
        const json = await response.json();
        return json.data;
    }
    catch (error) {
        if (error.name === 'AbortError') {
            throw new Error("Час очікування відповіді вичерпано");
        }
        if (error.message.includes('Failed to fetch')) {
            throw new Error("Помилка: Failed to fetch");
        }
        throw error;
    }
}
export async function fetchReports() {
    return apiFetch(`${API_URL}/reports`);
}
export async function fetchUsers() {
    return apiFetch(`${API_URL}/users`);
}
export async function fetchStatuses() {
    return apiFetch(`${API_URL}/statuses`);
}
export async function createReport(dto) {
    return apiFetch(`${API_URL}/reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto)
    });
}
export async function updateReport(id, dto) {
    return apiFetch(`${API_URL}/reports/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto)
    });
}
export async function deleteReport(id) {
    return apiFetch(`${API_URL}/reports/${id}`, {
        method: 'DELETE'
    });
}
