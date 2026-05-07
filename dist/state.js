/**
 * @typedef {import('./types.js').Report} Report
 * @typedef {import('./types.js').User} User
 * @typedef {import('./types.js').Status} Status
 */
export const state = {
    /** @type {Report[]} */
    reports: [],
    /** @type {User[]} */
    users: [],
    /** @type {Status[]} */
    statuses: [],
    editingId: null,
    searchQuery: "",
    filterStatus: "",
    filterSeverity: "",
    sortOrder: "",
    searchDebounce: null
};
export function getFilteredReports() {
    let filtered = [...state.reports];
    if (state.searchQuery) {
        const q = state.searchQuery.toLowerCase();
        filtered = filtered.filter(r => r.title.toLowerCase().includes(q) ||
            (r.authorName && r.authorName.toLowerCase().includes(q)));
    }
    if (state.filterStatus) {
        filtered = filtered.filter(r => r.status_id === parseInt(state.filterStatus));
    }
    if (state.filterSeverity) {
        filtered = filtered.filter(r => r.severity === state.filterSeverity);
    }
    if (state.sortOrder === "sevDesc") {
        const order = { "Критичний": 4, "Високий": 3, "Середній": 2, "Низький": 1 };
        filtered.sort((a, b) => (order[b.severity] || 0) - (order[a.severity] || 0));
    }
    else if (state.sortOrder === "sevAsc") {
        const order = { "Критичний": 4, "Високий": 3, "Середній": 2, "Низький": 1 };
        filtered.sort((a, b) => (order[a.severity] || 0) - (order[b.severity] || 0));
    }
    else if (state.sortOrder === "dateDesc") {
        filtered.sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return dateB - dateA;
        });
    }
    return filtered;
}
