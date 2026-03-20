const API_URL = "http://localhost:3000/api/reports";
const USERS_URL = "http://localhost:3000/api/users"; 
const severityRank = { "Низький": 1, "Середній": 2, "Високий": 3, "Критичний": 4 };
const form = document.getElementById("reportForm");
const clearBtn = document.getElementById("clearBtn");
const submitBtn = document.getElementById("submitBtn");
const titleInput = document.getElementById("title");
const severitySelect = document.getElementById("severity");
const statusSelect = document.getElementById("status");
const descriptionInput = document.getElementById("description");
const reporterInput = document.getElementById("reporter"); 
const editIdInput = document.getElementById("editId");
const titleError = document.getElementById("titleError");
const severityError = document.getElementById("severityError");
const statusError = document.getElementById("statusError");
const descriptionError = document.getElementById("descriptionError");
const reporterError = document.getElementById("reporterError");
const tbody = document.getElementById("reportsTableBody");
const searchInput = document.getElementById("searchInput");
const filterStatus = document.getElementById("filterStatus");
const filterSeverity = document.getElementById("filterSeverity");
const sortSelect = document.getElementById("sortSelect");
const clearFiltersBtn = document.getElementById("clearFiltersBtn");
let state = { reports: [], users: [], search: "", statusFilter: "", sevFilter: "", sort: "" };
async function loadUsers() {
    try {
        const res = await fetch(USERS_URL);
        state.users = await res.json();
    } catch (err) {
        console.error(err);
    }
}
function escapeHtml(s) {
    return String(s).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
function setError(el, msg) { if (el) el.textContent = msg; }
function markInvalid(input, isInvalid) { if (input) input.classList.toggle("invalid", isInvalid); }
function clearErrors() {
    [titleError, severityError, statusError, descriptionError, reporterError].forEach(el => setError(el, ""));
    [titleInput, severitySelect, statusSelect, descriptionInput, reporterInput].forEach(el => markInvalid(el, false));
}
function readForm() {
    return {
        title: titleInput.value.trim(),
        severity: severitySelect.value,
        status: statusSelect.value,
        description: descriptionInput.value.trim(),
        reporter: reporterInput.value.trim() 
    };
}
function validate(data) {
    clearErrors();
    let ok = true;
    if (!data.title) { setError(titleError, "Назва обов’язкова."); markInvalid(titleInput, true); ok = false; }
    if (!data.severity) { setError(severityError, "Оберіть критичність."); markInvalid(severitySelect, true); ok = false; }
    if (!data.status) { setError(statusError, "Оберіть статус."); markInvalid(statusSelect, true); ok = false; }
    if (!data.description) { setError(descriptionError, "Опис обов’язковий."); markInvalid(descriptionInput, true); ok = false; }
    if (!data.reporter) { setError(reporterError, "Вкажіть автора."); markInvalid(reporterInput, true); ok = false; }
    return ok;
}
function clearForm() {
    form.reset();
    editIdInput.value = "";
    submitBtn.textContent = "Додати";
    clearErrors();
}
async function loadReports() {
    const res = await fetch(API_URL);
    state.reports = await res.json();
    render();
}
async function addReport(data) {
    await fetch(USERS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: data.reporter })
    });
    const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    const saved = await res.json();
    state.reports.push(saved);
}
async function updateReport(id, data) {
    const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    const updated = await res.json();
    const idx = state.reports.findIndex(r => r.id === id);
    if (idx !== -1) state.reports[idx] = updated;
}
async function deleteReport(id) {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    state.reports = state.reports.filter(r => r.id !== id);
}
function getView() {
    let arr = [...state.reports];
    const q = state.search.toLowerCase();
    if (q) {
        arr = arr.filter(r => r.title.toLowerCase().includes(q) || r.reporter.toLowerCase().includes(q));
    }
    if (state.statusFilter) arr = arr.filter(r => r.status === state.statusFilter);
    if (state.sevFilter) arr = arr.filter(r => r.severity === state.sevFilter);
    if (state.sort === "severityDesc") arr.sort((a, b) => severityRank[b.severity] - severityRank[a.severity]);
    else if (state.sort === "severityAsc") arr.sort((a, b) => severityRank[a.severity] - severityRank[b.severity]);
    else if (state.sort === "titleAsc") arr.sort((a, b) => a.title.localeCompare(b.title, "uk"));
    else if (state.sort === "titleDesc") arr.sort((a, b) => b.title.localeCompare(a.title, "uk"));
    return arr;
}
function render() {
    const view = getView();
    tbody.innerHTML = view.map(r => `
        <tr data-id="${r.id}">
            <td>${escapeHtml(r.title)}</td>
            <td>${escapeHtml(r.severity)}</td>
            <td>${escapeHtml(r.status)}</td>
            <td>${escapeHtml(r.description)}</td>
            <td>${escapeHtml(r.reporter)}</td>
            <td>
                <button type="button" class="editBtn">Редагувати</button>
                <button type="button" class="deleteBtn">Видалити</button>
            </td>
        </tr>`).join("");
}
form.addEventListener("submit", async e => {
    e.preventDefault();
    const data = readForm();
    if (!validate(data)) return;
    const editId = editIdInput.value;
    if (editId) await updateReport(editId, data);
    else await addReport(data);
    render();
    clearForm();
});
tbody.addEventListener("click", async e => {
    const btn = e.target.closest("button");
    if (!btn) return;
    const id = btn.closest("tr").dataset.id;
    if (btn.classList.contains("deleteBtn")) {
        if (confirm("Видалити?")) { await deleteReport(id); render(); }
    }
    if (btn.classList.contains("editBtn")) {
        const r = state.reports.find(rep => rep.id === id);
        titleInput.value = r.title;
        severitySelect.value = r.severity;
        statusSelect.value = r.status;
        descriptionInput.value = r.description;
        reporterInput.value = r.reporter;
        editIdInput.value = r.id;
        submitBtn.textContent = "Зберегти";
    }
});
function syncFilters() {
    state.search = searchInput.value.trim();
    state.statusFilter = filterStatus.value;
    state.sevFilter = filterSeverity.value;
    state.sort = sortSelect.value;
    render();
}
[searchInput, filterStatus, filterSeverity, sortSelect].forEach(el => {
    el.addEventListener(el.id === "searchInput" ? "input" : "change", syncFilters);
});
clearFiltersBtn.addEventListener("click", () => {
    searchInput.value = ""; filterStatus.value = ""; filterSeverity.value = ""; sortSelect.value = "";
    syncFilters();
});
clearBtn.addEventListener("click", clearForm);
loadReports();
loadUsers();