export const state = {
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
    return filtered;
}
