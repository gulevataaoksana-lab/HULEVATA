const API_URL = "http://localhost:3000/api/reports-full";
const USERS_URL = "http://localhost:3000/api/users";
const BASE_REPORTS_URL = "http://localhost:3000/api/reports";

const severityRank = { "Низький": 1, "Середній": 2, "Високий": 3, "Критичний": 4 };

const form = document.getElementById("reportForm");
const titleInput = document.getElementById("title");
const severitySelect = document.getElementById("severity");
const statusSelect = document.getElementById("status");
const descriptionInput = document.getElementById("description");
const reporterInput = document.getElementById("reporter");
const editIdInput = document.getElementById("editId");
const submitBtn = document.getElementById("submitBtn");
const tbody = document.getElementById("reportsTableBody");

const searchInput = document.getElementById("searchInput");
const filterStatus = document.getElementById("filterStatus");
const filterSeverity = document.getElementById("filterSeverity");
const sortSelect = document.getElementById("sortSelect");

let state = { reports: [], users: [], search: "", statusFilter: "", sevFilter: "", sort: "" };

// 1. Завантаження даних
async function loadReports() {
    try {
        const res = await fetch(API_URL);
        const json = await res.json();
        console.log("Дані з сервера:", json.data);
        state.reports = json.data || [];
        render();
    } catch (err) {
        console.error("Помилка завантаження звітів:", err);
    }
}

async function loadUsers() {
    try {
        const res = await fetch(USERS_URL);
        const json = await res.json();
        state.users = json.data || [];
    } catch (err) {
        console.error("Помилка завантаження користувачів:", err);
    }
}

// 2. Додавання звіту
async function addReport(data) {
    try {
        // ФІКС: Відправляємо title і name одночасно, щоб догодити валідатору на бекенді
        const reportData = {
            title: data.title,       
            name: data.title,        // Додано як дублікат, якщо бекенд шукає "name"
            severity: data.severity,
            status: data.status,
            description: data.description,
            reporter_id: data.reporter,
            createdAt: new Date().toISOString()
        };

        const res = await fetch(BASE_REPORTS_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(reportData)
        });

        const result = await res.json();

        if (!res.ok) {
            // Виводимо конкретну помилку з сервера (наприклад, "Назва обов'язкова")
            alert("Сервер відхилив запит: " + (result.message || "Невідома помилка"));
            return false;
        }

        await loadReports();
        return true; 
    } catch (err) {
        console.error("Критична помилка при додаванні:", err);
        return false;
    }
}

// 3. Оновлення
async function updateReport(id, data) {
    try {
        const res = await fetch(`${BASE_REPORTS_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: data.title,
                name: data.title,
                severity: data.severity,
                status: data.status,
                description: data.description,
                reporter_id: data.reporter
            })
        });
        if (res.ok) {
            await loadReports();
            return true;
        }
        return false;
    } catch (err) { console.error(err); return false; }
}

// 4. Видалення
async function deleteReport(id) {
    try {
        const res = await fetch(`${BASE_REPORTS_URL}/${id}`, { method: "DELETE" });
        if (res.ok) await loadReports();
    } catch (err) { console.error(err); }
}

// 5. Рендеринг
function escapeHtml(s) {
    if (!s) return "";
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function render() {
    const view = getView();
    if (!tbody) return;

    if (view.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 20px;">Дані відсутні або зафільтровані</td></tr>`;
        return;
    }

    tbody.innerHTML = view.map(r => `
        <tr data-id="${r.id}">
            <td>${escapeHtml(r.title || r.name)}</td>
            <td><span class="badge-${r.severity}">${escapeHtml(r.severity)}</span></td>
            <td>${escapeHtml(r.status)}</td>
            <td>${escapeHtml(r.description)}</td>
            <td><strong>${escapeHtml(r.authorName || r.reporter_id)}</strong></td>
            <td>
                <button type="button" class="editBtn">Редавати</button>
                <button type="button" class="deleteBtn">Видалити</button>
            </td>
        </tr>`).join("");
}

function getView() {
    let arr = [...state.reports];
    const q = state.search.toLowerCase();
    
    if (q) {
        arr = arr.filter(r => 
            (r.title && r.title.toLowerCase().includes(q)) || 
            (r.name && r.name.toLowerCase().includes(q)) ||
            (r.authorName && r.authorName.toLowerCase().includes(q))
        );
    }
    
    if (state.statusFilter) arr = arr.filter(r => r.status === state.statusFilter);
    if (state.sevFilter) arr = arr.filter(r => r.severity === state.sevFilter);
    
    if (state.sort && state.sort.includes("severity")) {
        arr.sort((a, b) => {
            const val = (severityRank[a.severity] || 0) - (severityRank[b.severity] || 0);
            return state.sort === "severityAsc" ? val : -val;
        });
    }
    return arr;
}

// 6. Слухачі
form.addEventListener("submit", async e => {
    e.preventDefault();
    
    const data = {
        title: titleInput.value.trim(),
        severity: severitySelect.value,
        status: statusSelect.value,
        description: descriptionInput.value.trim(),
        reporter: reporterInput.value.trim()
    };
    
    if (!data.title || !data.reporter) {
        alert("Заповніть назву та ID автора (наприклад, u1)");
        return;
    }

    const editId = editIdInput.value;
    let success = false;

    if (editId) {
        success = await updateReport(editId, data);
    } else {
        success = await addReport(data);
    }
    
    if (success) {
        form.reset();
        editIdInput.value = "";
        submitBtn.textContent = "Додати";
    }
});

tbody.addEventListener("click", async e => {
    const btn = e.target.closest("button");
    if (!btn) return;
    const tr = btn.closest("tr");
    const id = tr.dataset.id;

    if (btn.classList.contains("deleteBtn")) {
        if (confirm("Видалити цей звіт?")) await deleteReport(id);
    }

    if (btn.classList.contains("editBtn")) {
        const r = state.reports.find(rep => String(rep.id) === String(id));
        if (r) {
            titleInput.value = r.title || r.name || "";
            severitySelect.value = r.severity;
            statusSelect.value = r.status;
            descriptionInput.value = r.description;
            reporterInput.value = r.reporter_id;
            editIdInput.value = r.id;
            submitBtn.textContent = "Зберегти зміни";
            window.scrollTo(0, 0);
        }
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
    if (el) el.addEventListener(el.id === "searchInput" ? "input" : "change", syncFilters);
});
loadReports();
loadUsers();