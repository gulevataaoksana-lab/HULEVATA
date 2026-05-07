import { getFilteredReports, state } from './state.js';
import { ReportService, UserService, StatusService } from './apiClients.js';
import { renderAll, showToast, showLoader, hideLoader, populateSelects } from './ui.js';

async function loadAndRender() {
    showLoader();
    try {
        const [reports, users, statuses] = await Promise.all([
            ReportService.getReports(),
            UserService.getUsers(),
            StatusService.getStatuses()
        ]);
        
        state.reports = reports || [];
        state.users = users || [];
        state.statuses = statuses || [];
        
        populateSelects(state.statuses);
        renderAll(getFilteredReports(), state.statuses, state.users);
    }
    catch (e) {
        const message = e instanceof Error ? e.message : "Невідома помилка";
        console.error("Помилка завантаження:", e);
        showToast(`Помилка: ${message}`, "error");
    }
    finally {
        hideLoader();
    }
}

function validateForm(data) {
    if (data.title.length < 3) return "Назва занадто коротка";
    if (!data.reporter_id || !data.authorName) return "Заповніть дані автора";
    if (!data.status_id) return "Оберіть статус";
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
            await ReportService.updateReport(state.editingId, dto);
            showToast("Звіт оновлено!");
            state.editingId = null;
        } else {
            await ReportService.createReport(dto);
            showToast("Звіт додано!");
        }
        await loadAndRender();
        form.reset();
    }
    catch (err) {
        console.warn("API Unavailable, applying local changes:", err);
        
        if (state.editingId) {
            const index = state.reports.findIndex(r => r.id === state.editingId);
            if (index !== -1) state.reports[index] = { ...state.reports[index], ...dto };
            showToast("Оновлено локально!");
            state.editingId = null;
        } else {
            dto.id = Date.now().toString(); 
            state.reports.push(dto);
            showToast("Додано локально!");
        }
        
        if (dto.reporter_id && dto.authorName) {
            const userIndex = state.users.findIndex(u => u.id === dto.reporter_id);
            if (userIndex === -1) {
                state.users.push({ id: dto.reporter_id, name: dto.authorName });
            } else {
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
        if (state.searchDebounce) clearTimeout(state.searchDebounce);
        state.searchDebounce = setTimeout(() => renderAll(getFilteredReports(), state.statuses, state.users), 300);
    });
    
    const filters = ["filterStatus", "filterSeverity", "sortOrder"];
    filters.forEach(id => {
        document.getElementById(id)?.addEventListener("change", (e) => {
            state[id] = e.target.value;
            renderAll(getFilteredReports(), state.statuses, state.users);
        });
    });
    
    document.getElementById("clearBtn")?.addEventListener("click", () => {
        ["searchInput", "filterStatus", "filterSeverity", "sortOrder"].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = "";
            state[id === "searchInput" ? "searchQuery" : id] = "";
        });
        renderAll(getFilteredReports(), state.statuses, state.users);
    });

    document.body.addEventListener("click", async (e) => {
        const btn = e.target.closest("button");
        if (!btn) return;
        
        const row = btn.closest("tr");
        const id = row?.dataset.id;
        const action = btn.dataset.action;

        if (action === "delete") {
            const tableTitle = btn.closest("section")?.querySelector("h2")?.innerText || "";
            
            if (tableTitle.includes("звітів")) {
                try {
                    await ReportService.deleteReport(id);
                    showToast("Звіт видалено");
                    await loadAndRender();
                } catch (err) {
                    state.reports = state.reports.filter(r => r.id !== id);
                    renderAll(getFilteredReports(), state.statuses, state.users);
                    showToast("Видалено локально");
                }
            } else if (tableTitle.includes("Користувачі")) {
                state.users = state.users.filter(u => u.id !== id);
                renderAll(getFilteredReports(), state.statuses, state.users);
                showToast("Користувача видалено!");
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
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
    });

    await loadAndRender();
}

window.addEventListener("DOMContentLoaded", init);