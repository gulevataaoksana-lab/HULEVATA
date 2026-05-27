import { getFilteredReports, state } from './state.js';
import { ReportService, UserService, StatusService } from './apiClients.js';
import { renderAll, showToast, showLoader, hideLoader, populateSelects, renderStats } from './ui.js';
import { CreateReportDto } from './types.js';

function onSearch(e: Event) {
    const target = e.target as HTMLInputElement;
    if (state.searchDebounce) clearTimeout(state.searchDebounce);
    state.searchDebounce = window.setTimeout(async () => {
        state.searchQuery = target.value;
        showLoader();
        try {
            const reports = await ReportService.getReports(state.searchQuery);
            state.reports = reports || [];
            renderAll(getFilteredReports(), state.statuses, state.users);
        } catch (error) {
            showToast("Помилка пошуку", "error");
        } finally {
            hideLoader();
        }
    }, 300);
}

function onFilterChange() {
    state.filterStatus = (document.getElementById("filterStatus") as HTMLSelectElement).value;
    state.filterSeverity = (document.getElementById("filterSeverity") as HTMLSelectElement).value;
    state.sortOrder = (document.getElementById("sortOrder") as HTMLSelectElement).value;
    renderAll(getFilteredReports(), state.statuses, state.users);
}

async function loadAndRender() {
    showLoader();
    try {
        const [reports, users, statuses] = await Promise.all([
            ReportService.getReports(state.searchQuery),
            UserService.getUsers(),
            StatusService.getStatuses()
        ]);
        state.reports = reports || [];
        state.users = users || [];
        state.statuses = statuses || [];
        
        populateSelects(state.statuses);
        renderAll(getFilteredReports(), state.statuses, state.users);
    } catch (err) {
        console.error(err);
        showToast("Не вдалося завантажити дані", "error");
    } finally {
        hideLoader();
    }
}

async function onSubmit(e: Event) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    
    const titleInput = document.getElementById("title") as HTMLInputElement;
    const severityInput = document.getElementById("severity") as HTMLSelectElement;
    const statusInput = document.getElementById("status") as HTMLSelectElement;
    const descInput = document.getElementById("description") as HTMLTextAreaElement;

    if (titleInput.value.trim().length < 3) {
        showToast("Назва звіту має містити мінімум 3 символи", "error");
        return;
    }

    if (!severityInput.value) {
        showToast("Оберіть серйозність", "error");
        return;
    }

    const dto: CreateReportDto = {
        title: titleInput.value.trim(),
        severity: severityInput.value,
        status_id: parseInt(statusInput.value),
        description: descInput.value.trim()
    };

    try {
        showLoader();
        if (state.editingId) {
            await ReportService.updateReport(state.editingId, dto);
            showToast("Звіт оновлено");
        } else {
            await ReportService.createReport(dto);
            showToast("Звіт створено");
        }
        form.reset();
        state.editingId = null;
        const fTitle = document.getElementById("formTitle");
        if (fTitle) fTitle.textContent = "Створити новий звіт";
        await loadAndRender();
    } catch (e: any) {
        showToast(e.message || "Помилка збереження", "error");
    } finally {
        hideLoader();
    }
}


async function onLogin(e: Event) {
    e.preventDefault();
    const username = (document.getElementById("loginUsername") as HTMLInputElement).value;
    const password = (document.getElementById("loginPassword") as HTMLInputElement).value;

    showLoader();
    try {
        const response = await fetch("http://localhost:3000/api/v1/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
            throw new Error("Невірні облікові дані");
        }

        const result = await response.json();
        localStorage.setItem("token", result.token);
        localStorage.setItem("username", username);

        checkAuthStatus();
        showToast("Вхід успішний!");
        await loadAndRender();
    } catch (err: any) {
        showToast(err.message || "Помилка автентифікації", "error");
    } finally {
        hideLoader();
    }
}

function onLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    checkAuthStatus();
    showToast("Ви вийшли із системи");
}

function checkAuthStatus() {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    
    const loginForm = document.getElementById("loginForm");
    const userInfoBlock = document.getElementById("userInfoBlock");
    const currentUserName = document.getElementById("currentUserName");

    if (token && username) {
        if (loginForm) loginForm.classList.add("hidden");
        if (userInfoBlock) userInfoBlock.classList.remove("hidden");
        if (currentUserName) currentUserName.textContent = username;
    } else {
        if (loginForm) loginForm.classList.remove("hidden");
        if (userInfoBlock) userInfoBlock.classList.add("hidden");
        const userFormInput = document.getElementById("loginPassword") as HTMLInputElement;
        if (userFormInput) userFormInput.value = "";
    }
}

function init() {
    checkAuthStatus();
    document.getElementById("resetFiltersBtn")?.addEventListener("click", () => {
        (document.getElementById("searchInput") as HTMLInputElement).value = "";
        (document.getElementById("sortOrder") as HTMLSelectElement).value = "";
        (document.getElementById("filterStatus") as HTMLSelectElement).value = "";
        (document.getElementById("filterSeverity") as HTMLSelectElement).value = "";

        state.searchQuery = "";
        state.filterStatus = "";
        state.filterSeverity = "";
        state.sortOrder = "";

        renderAll(getFilteredReports(), state.statuses, state.users);
    });
    document.getElementById("searchInput")?.addEventListener("input", onSearch);
    document.getElementById("sortOrder")?.addEventListener("change", onFilterChange);
    document.getElementById("filterStatus")?.addEventListener("change", onFilterChange);
    document.getElementById("filterSeverity")?.addEventListener("change", onFilterChange);
    
    document.getElementById("reportForm")?.addEventListener("submit", onSubmit);
    document.getElementById("loginForm")?.addEventListener("submit", onLogin);
    document.getElementById("logoutBtn")?.addEventListener("click", onLogout);

    document.getElementById("clearBtn")?.addEventListener("click", () => {
        const form = document.getElementById("reportForm") as HTMLFormElement;
        form?.reset();
        state.editingId = null;
        const fTitle = document.getElementById("formTitle");
        if (fTitle) fTitle.textContent = "Створити новий звіт";
    });

    document.getElementById("addStatusBtn")?.addEventListener("click", async () => {
        const input = document.getElementById("newStatusName") as HTMLInputElement;
        if (!input || !input.value.trim()) return;
        showLoader();
        try {
            await fetch("http://localhost:3000/api/v1/statuses", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: input.value.trim() })
            });
            input.value = "";
            showToast("Статус додано");
            await loadAndRender();
        } catch {
            showToast("Помилка створення статусу", "error");
        } finally {
            hideLoader();
        }
    });

    document.getElementById("getStatsBtn")?.addEventListener("click", async () => {
        const sev = (document.getElementById("statSeverity") as HTMLSelectElement).value;
        const stat = (document.getElementById("statStatus") as HTMLSelectElement).value;
        showLoader();
        try {
            const stats = await ReportService.getStatsAfterPost(sev, stat);
            renderStats(stats || [], state.statuses);
        } catch {
            showToast("Помилка розрахунку", "error");
        } finally {
            hideLoader();
        }
    });

    document.body.addEventListener("click", async (e) => {
        const target = e.target as HTMLElement;
        const action = target.dataset.action;
        if (!action) return;
        
        const tr = target.closest("tr");
        if (!tr) return;
        const id = tr.dataset.id;
        if (!id) return;
 
        const tableElement = tr.closest("table");
        
        try {
            showLoader();
            if (action === "delete") {
                if (tableElement?.querySelector("thead th")?.textContent?.includes("ID")) {
                    if (tableElement.innerHTML.includes("Доступні статуси") || tableElement.closest(".panel")?.innerHTML.includes("Доступні статуси")) {
                        await StatusService.deleteStatus(id);
                        showToast("Статус видалено");
                    } else {
                        await UserService.deleteUser(id);
                        showToast("Користувача видалено");
                    }
                } else {
                    await ReportService.deleteReport(id);
                    showToast("Звіт видалено");
                }
                await loadAndRender();
            } else if (action === "edit") {
                const report = state.reports.find(r => String(r.id) === id);
                if (report) {
                    (document.getElementById("title") as HTMLInputElement).value = report.title;
                    (document.getElementById("severity") as HTMLSelectElement).value = report.severity;
                    (document.getElementById("status") as HTMLSelectElement).value = report.status_id.toString();
                    (document.getElementById("description") as HTMLTextAreaElement).value = report.description || '';
                    
                    state.editingId = id;
                    const fTitle = document.getElementById("formTitle");
                    if (fTitle) fTitle.textContent = "Редагувати звіт #" + id;
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            }
        } catch (err: any) {
            console.error(err);
            showToast(err.message || "Дія не вдалася", "error");
        } finally {
            hideLoader();
        }
    }); 

    loadAndRender();
} 

window.addEventListener("DOMContentLoaded", init);