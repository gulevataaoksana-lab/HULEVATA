import { getFilteredReports, state } from './state.js';
import * as api from './apiClients.js';
import { renderAll, showToast, showLoader, hideLoader, populateSelects } from './ui.js';
async function loadAndRender() {
    showLoader();
    try {
        const [reports, users, statuses] = await Promise.all([
            api.fetchReports(),
            api.fetchUsers(),
            api.fetchStatuses()
        ]);
        state.reports = reports || [];
        state.users = users || [];
        state.statuses = statuses || [];
        populateSelects(state.statuses);
        renderAll(getFilteredReports(), state.statuses, state.users);
    }
    catch (e) {
        console.error("API Error:", e);
        showToast(`Помилка завантаження: ${e.message}`, "error");
        const tbody = document.getElementById("reportsTableBody");
        if (tbody) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: red;">Помилка завантаження даних (Error State). Спробуйте пізніше.</td></tr>`;
        }
    }
    finally {
        hideLoader();
    }
}
function validateForm(data) {
    if (data.title.length < 3)
        return "Назва занадто коротка";
    if (!data.reporter_id || !data.authorName)
        return "Заповніть дані автора";
    if (!data.status_id)
        return "Оберіть статус";
    return null;
}
async function onSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const dto = {
        title: document.getElementById("title").value,
        severity: document.getElementById("severity").value,
        status_id: parseInt(document.getElementById("status").value),
        description: document.getElementById("description").value,
        reporter_id: document.getElementById("userId").value,
        authorName: document.getElementById("userName").value
    };
    const error = validateForm(dto);
    if (error) {
        showToast(error, "error");
        return;
    }
    showLoader();
    try {
        if (state.editingId) {
            await api.updateReport(state.editingId, dto);
            showToast("Звіт оновлено!");
            state.editingId = null;
        }
        else {
            await api.createReport(dto);
            showToast("Звіт додано!");
        }
        await loadAndRender();
        form.reset();
    }
    catch (err) {
        console.warn("API Error, applying offline fallback:", err);
        if (state.editingId) {
            const index = state.reports.findIndex(r => r.id === state.editingId);
            if (index !== -1) {
                state.reports[index] = { ...state.reports[index], ...dto };
            }
            showToast("Оновлено локально!");
            state.editingId = null;
        }
        else {
            dto.id = Date.now().toString();
            state.reports.push(dto);
            showToast("Додано локально!");
        }
        if (dto.reporter_id && dto.authorName) {
            const userIndex = state.users.findIndex(u => u.id === dto.reporter_id);
            if (userIndex === -1) {
                state.users.push({
                    id: dto.reporter_id,
                    name: dto.authorName
                });
            }
            else {
                state.users[userIndex].name = dto.authorName;
            }
        }
        renderAll(getFilteredReports(), state.statuses, state.users);
        form.reset();
    }
    finally {
        hideLoader();
    }
}
async function init() {
    document.getElementById("reportForm")?.addEventListener("submit", onSubmit);
    document.getElementById("searchInput")?.addEventListener("input", (e) => {
        state.searchQuery = e.target.value;
        if (state.searchDebounce)
            clearTimeout(state.searchDebounce);
        state.searchDebounce = setTimeout(() => renderAll(getFilteredReports(), state.statuses, state.users), 300);
    });
    document.getElementById("filterStatus")?.addEventListener("change", (e) => {
        state.filterStatus = e.target.value;
        renderAll(getFilteredReports(), state.statuses, state.users);
    });
    document.getElementById("filterSeverity")?.addEventListener("change", (e) => {
        state.filterSeverity = e.target.value;
        renderAll(getFilteredReports(), state.statuses, state.users);
    });
    document.getElementById("sortOrder")?.addEventListener("change", (e) => {
        state.sortOrder = e.target.value;
        renderAll(getFilteredReports(), state.statuses, state.users);
    });
    document.getElementById("clearBtn")?.addEventListener("click", () => {
        document.getElementById("searchInput").value = "";
        document.getElementById("filterStatus").value = "";
        document.getElementById("filterSeverity").value = "";
        document.getElementById("sortOrder").value = "";
        state.searchQuery = "";
        state.filterStatus = "";
        state.filterSeverity = "";
        state.sortOrder = "";
        renderAll(getFilteredReports(), state.statuses, state.users);
    });
    document.getElementById("addStatusBtn")?.addEventListener("click", () => {
        const input = document.getElementById("newStatusName");
        const newName = input.value.trim();
        if (!newName) {
            showToast("Будь ласка, введіть назву статусу!", "error");
            return;
        }
        const newId = state.statuses.length > 0
            ? Math.max(...state.statuses.map(s => s.id)) + 1
            : 1;
        state.statuses.push({ id: newId, name: newName });
        input.value = "";
        populateSelects(state.statuses);
        renderAll(getFilteredReports(), state.statuses, state.users);
        showToast("Новий статус успішно додано!");
    });
    document.getElementById("usersTableBody")?.addEventListener("click", (e) => {
        const btn = e.target.closest("button");
        if (!btn || btn.dataset.action !== "delete")
            return;
        const row = btn.closest("tr");
        const id = row.dataset.id;
        state.users = state.users.filter(u => u.id !== id);
        renderAll(getFilteredReports(), state.statuses, state.users);
        showToast("Користувача видалено!");
    });
    document.getElementById("statusesTableBody")?.addEventListener("click", (e) => {
        const btn = e.target.closest("button");
        if (!btn || btn.dataset.action !== "delete")
            return;
        const row = btn.closest("tr");
        const id = parseInt(row.dataset.id);
        state.statuses = state.statuses.filter(s => s.id !== id);
        populateSelects(state.statuses);
        renderAll(getFilteredReports(), state.statuses, state.users);
        showToast("Статус видалено!");
    });
    document.getElementById("reportsTableBody")?.addEventListener("click", async (e) => {
        const btn = e.target.closest("button");
        if (!btn)
            return;
        const row = btn.closest("tr");
        const id = row.dataset.id;
        const action = btn.dataset.action;
        if (action === "delete") {
            try {
                await api.deleteReport(id);
                showToast("Звіт видалено");
                await loadAndRender();
            }
            catch (err) {
                state.reports = state.reports.filter(r => r.id !== id);
                renderAll(getFilteredReports(), state.statuses, state.users);
                showToast("Видалено локально");
            }
        }
        else if (action === "edit") {
            const report = state.reports.find((r) => r.id === id);
            if (report) {
                document.getElementById("title").value = report.title;
                document.getElementById("severity").value = report.severity;
                document.getElementById("status").value = report.status_id;
                document.getElementById("description").value = report.description || '';
                document.getElementById("userId").value = report.reporter_id || '';
                document.getElementById("userName").value = report.authorName || '';
                state.editingId = id;
            }
        }
    });
    await loadAndRender();
}
window.addEventListener("DOMContentLoaded", init);
