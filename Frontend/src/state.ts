import { Report, User, Status } from './types.js';

interface AppState {
    reports: Report[];
    users: User[];
    statuses: Status[];
    editingId: string | number | null;
    searchQuery: string;
    filterStatus: string;
    filterSeverity: string;
    sortOrder: string;
    searchDebounce: number | null;
}

export const state: AppState = {
    reports: [],
    users: [],
    statuses: [],
    editingId: null,
    searchQuery: "",
    filterStatus: "",
    filterSeverity: "",
    sortOrder: "",
    searchDebounce: null
};

export function getFilteredReports(): Report[] {
    let filtered = [...state.reports];
    
    if (state.searchQuery) {
        const q = state.searchQuery.toLowerCase();
        filtered = filtered.filter(r => r.title.toLowerCase().includes(q) ||
            (r.authorName && r.authorName.toLowerCase().includes(q)));
    }
    
    if (state.filterStatus) {
    filtered = filtered.filter(r => String(r.status_id) === String(state.filterStatus));
}
    
    if (state.filterSeverity) {
        filtered = filtered.filter(r => r.severity === state.filterSeverity);
    }
    
    if (state.sortOrder === "sevDesc") {
        const order: Record<string, number> = { "Критичний": 4, "Високий": 3, "Середній": 2, "Низький": 1 };
        filtered.sort((a, b) => (order[b.severity] || 0) - (order[a.severity] || 0));
    }
    else if (state.sortOrder === "sevAsc") {
        const order: Record<string, number> = { "Критичний": 4, "Високий": 3, "Середній": 2, "Низький": 1 };
        filtered.sort((a, b) => (order[a.severity] || 0) - (order[b.severity] || 0));
    }
    if (state.sortOrder === "status") {
    filtered.sort((a, b) => {
        const statusA = state.statuses.find(s => s.id === a.status_id)?.name || "";
        const statusB = state.statuses.find(s => s.id === b.status_id)?.name || "";
        return statusA.localeCompare(statusB);
    });
}
    return filtered;
}