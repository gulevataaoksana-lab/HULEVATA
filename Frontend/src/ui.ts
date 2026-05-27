import { Report, User, Status } from './types.js';
import { ISeverityStat } from './apiClients.js';
export function showLoader(): void {
    document.getElementById("globalLoader")?.classList.remove("hidden");
}

export function hideLoader(): void {
    document.getElementById("globalLoader")?.classList.add("hidden");
}

export function showToast(message: string, type: string = 'success'): void {
    const container = document.getElementById("toastContainer");
    if (!container) return;
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.innerText = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

export function populateSelects(statuses: Status[]): void {
    const statusFilter = document.getElementById("filterStatus");
    const statusForm = document.getElementById("status"); 
    const statStatusForm = document.getElementById("statStatus");
    
    const options = statuses.map(s => `<option value="${s.id}">${escapeHtml(s.name)}</option>`).join('');

    if (statusFilter) {
        statusFilter.innerHTML = '<option value="">Статус (усі)</option>' + options;
    }

    if (statusForm) {
        statusForm.innerHTML = '<option value="" disabled selected>Оберіть статус</option>' + options;
    }

    if (statStatusForm) {
        statStatusForm.innerHTML = '<option value="" disabled selected>Оберіть статус</option>' + options;
    }
}

export function renderStats(stats: ISeverityStat[], statuses: Status[]): void {
    const body = document.getElementById("severityStatsBody");
    if (!body) return;

    body.innerHTML = stats
        .slice() 
        .sort((a, b) => b.count - a.count) 
        .map(s => {
            const statusName = statuses.find(st => st.id === Number(s.status_id))?.name || "Невідомо";
            return `
                <tr>
                    <td>${escapeHtml(s.severity)}</td>
                    <td>${escapeHtml(statusName)}</td>
                    <td>${s.count}</td>
                </tr>
            `;
        }).join('');
}

export function renderAll(filteredReports: Report[], statuses: Status[], users: User[]): void {
    const tbody = document.getElementById("reportsTableBody");
    if (tbody) {
        tbody.innerHTML = ''; 
        
        if (filteredReports.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 20px;">Дані відсутні</td></tr>';
        } else {
            filteredReports.forEach(r => {
                const tr = document.createElement('tr');
                tr.dataset.id = String(r.id);

                const tdTitle = document.createElement('td');
                tdTitle.textContent = r.title;
                const tdSeverity = document.createElement('td');
                tdSeverity.textContent = r.severity;

                const tdStatus = document.createElement('td');
                tdStatus.textContent = statuses.find(s => s.id === r.status_id)?.name || String(r.status_id);

                const tdDesc = document.createElement('td');
                tdDesc.textContent = r.description || '';

                const tdAuthor = document.createElement('td');
                tdAuthor.textContent = r.authorName || 'Анонім';

                const tdActions = document.createElement('td');
                tdActions.innerHTML = `
                    <button class="btn-edit" data-action="edit">Редагувати</button>
                    <button class="btn-delete" data-action="delete">Видалити</button>
                `;

                tr.append(tdTitle, tdSeverity, tdStatus, tdDesc, tdAuthor, tdActions);
                tbody.appendChild(tr);
            });
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