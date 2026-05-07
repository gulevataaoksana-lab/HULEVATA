import { getFilteredReports, state } from './state.js';
import { ReportService, UserService, StatusService } from './apiClients.js'; // Use Services
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
    catch (e: unknown) { 
        let errorMessage = "Невідома помилка";
        if (e instanceof Error) {
            errorMessage = e.message;
        }
        console.error("API Error:", e);
        showToast(`Помилка завантаження: ${errorMessage}`, "error");
        
        const tbody = document.getElementById("reportsTableBody");
        if (tbody) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: red;">Помилка завантаження даних.</td></tr>`;
        }
    }
    finally {
        hideLoader();
    }
}

function validateForm(data: any) {
    if (data.title.length < 3) return "Назва занадто коротка";
    if (!data.reporter_id || !data.authorName) return "Заповніть дані автора";
    if (!data.status_id) return "Оберіть статус";
    return null;
}

async function onSubmit(e: Event) {
    e.preventDefault();
    
    const data = {
        title: (document.getElementById("title") as HTMLInputElement).value.trim(),
        severity: (document.getElementById("severity") as HTMLSelectElement).value,
        status_id: parseInt((document.getElementById("status") as HTMLSelectElement).value),
        description: (document.getElementById("description") as HTMLTextAreaElement).value.trim(),
        reporter_id: (document.getElementById("userId") as HTMLInputElement).value.trim(),
        authorName: (document.getElementById("userName") as HTMLInputElement).value.trim()
    };

    const error = validateForm(data);
    if (error) {
        showToast(error, "error");
        return;
    }

    try {
        if (state.editingId) {
            await ReportService.updateReport(state.editingId, data);
            showToast("Звіт оновлено");
            state.editingId = null;
        } else {
            await ReportService.createReport(data);
            showToast("Звіт створено");
        }
        (document.getElementById("reportForm") as HTMLFormElement).reset();
        await loadAndRender();
    } catch (err: unknown) {
        if (err instanceof Error) {
            showToast(`Помилка: ${err.message}`, "error");
        } else {
            showToast("Невідома помилка", "error");
        }
    }
}

function onSearch(e: Event) {
    const target = e.target as HTMLInputElement;
    if (state.searchDebounce) clearTimeout(state.searchDebounce);
    state.searchDebounce = setTimeout(() => {
        state.searchQuery = target.value;
        renderAll(getFilteredReports(), state.statuses, state.users);
    }, 300) as unknown as number;
}

function onFilterChange() {
    state.filterStatus = (document.getElementById("filterStatus") as HTMLSelectElement).value;
    state.filterSeverity = (document.getElementById("filterSeverity") as HTMLSelectElement).value;
    state.sortOrder = (document.getElementById("sortOrder") as HTMLSelectElement).value;
    renderAll(getFilteredReports(), state.statuses, state.users);
}

function init() {
    document.getElementById("reportForm")?.addEventListener("submit", onSubmit);
    document.getElementById("searchInput")?.addEventListener("input", onSearch);
    document.getElementById("filterStatus")?.addEventListener("change", onFilterChange);
    document.getElementById("filterSeverity")?.addEventListener("change", onFilterChange);
    document.getElementById("sortOrder")?.addEventListener("change", onFilterChange);

    document.getElementById("reportsTableBody")?.addEventListener("click", async (e: Event) => {
        const target = e.target as HTMLElement;
        const btn = target.closest("button");
        if (!btn) return;

        const row = btn.closest("tr");
        if (!row) return;
        
        const id = row.dataset.id;
        if (!id) return;
        
        const action = btn.dataset.action;

        if (action === "delete") {
            try {
                await ReportService.deleteReport(id);
                showToast("Звіт видалено");
                await loadAndRender();
            } catch (err) {
                state.reports = state.reports.filter(r => String(r.id) !== id);
                renderAll(getFilteredReports(), state.statuses, state.users);
                showToast("Видалено");
            }
        } else if (action === "edit") {
            const report = state.reports.find((r) => String(r.id) === id);
            if (report) {
                (document.getElementById("title") as HTMLInputElement).value = report.title;
                (document.getElementById("severity") as HTMLSelectElement).value = report.severity;
                (document.getElementById("status") as HTMLSelectElement).value = report.status_id.toString();
                (document.getElementById("description") as HTMLTextAreaElement).value = report.description || '';
                (document.getElementById("userId") as HTMLInputElement).value = report.reporter_id || '';
                (document.getElementById("userName") as HTMLInputElement).value = report.authorName || '';
                state.editingId = id;
            }
        }
    });

    loadAndRender();
}

window.addEventListener("DOMContentLoaded", init);