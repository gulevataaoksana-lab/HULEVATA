export function showLoader() {
    document.getElementById("globalLoader")?.classList.remove("hidden");
}
export function hideLoader() {
    document.getElementById("globalLoader")?.classList.add("hidden");
}
export function showToast(message, type = 'success') {
    const container = document.getElementById("toastContainer");
    if (!container)
        return;
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.innerText = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
export function populateSelects(statuses) {
    const statusFilter = document.getElementById("filterStatus");
    const statusForm = document.getElementById("status");
    const options = statuses.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
    if (statusFilter) {
        statusFilter.innerHTML = '<option value="">Статус (усі)</option>' + options;
    }
    if (statusForm) {
        statusForm.innerHTML = '<option value="">Оберіть статус</option>' + options;
    }
}
export function renderAll(filteredReports, statuses, users) {
    const tbody = document.getElementById("reportsTableBody");
    if (tbody) {
        if (filteredReports.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 20px;">Дані відсутні</td></tr>';
        }
        else {
            tbody.innerHTML = filteredReports.map(r => `
                <tr data-id="${r.id}">
                    <td>${escapeHtml(r.title)}</td>
                    <td>${escapeHtml(r.severity)}</td>
                    <td>${escapeHtml(statuses.find(s => s.id === r.status_id)?.name || r.status_id.toString())}</td>
                    <td>${escapeHtml(r.description || '')}</td>
                    <td>${escapeHtml(r.authorName || 'Анонім')}</td>
                    <td>
                        <button class="btn-edit" data-action="edit">Редагувати</button>
                        <button class="btn-delete" data-action="delete">Видалити</button>
                    </td>
                </tr>
            `).join('');
        }
    }
    const uBody = document.getElementById("usersTableBody");
    if (uBody) {
        uBody.innerHTML = users.map(u => `
            <tr data-id="${u.id}"> <td>${u.id}</td>
                <td>${escapeHtml(u.name)}</td>
                <td>
                    <button class="btn-delete" data-action="delete">Видалити</button>
                </td>
            </tr>
        `).join('');
    }
    const sBody = document.getElementById("statusesTableBody");
    if (sBody) {
        sBody.innerHTML = statuses.map(s => `
            <tr data-id="${s.id}"> <td>${s.id}</td>
                <td>${escapeHtml(s.name)}</td>
                <td>${escapeHtml(s.description || '')}</td>
                <td>
                    <button class="btn-delete" data-action="delete">Видалити</button>
                </td>
            </tr>
        `).join('');
    }
}
