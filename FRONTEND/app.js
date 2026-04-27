const BASE_URL = "http://localhost:3000/api/v1";

const severityRank = { 
    "Низький": 1, 
    "Середній": 2, 
    "Високий": 3, 
    "Критичний": 4 
};

let state = { 
    reports: [], 
    users: [], 
    statuses: [], 
    search: "", 
    statusFilter: "", 
    sevFilter: "",
    sortOrder: "" 
};

async function loadAllData() {
    const tableBody = document.getElementById("reportsTableBody");
    if (tableBody) {
        tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Завантаження...</td></tr>';
    }

    try {
        const [repRes, usrRes, stsRes] = await Promise.all([
            fetch(`${BASE_URL}/reports`),
            fetch(`${BASE_URL}/users`),
            fetch(`${BASE_URL}/statuses`)
        ]);

        if (!repRes.ok || !usrRes.ok || !stsRes.ok) {
            throw new Error(`Помилка завантаження даних`);
        }

        const repData = await repRes.json();
        const usrData = await usrRes.json();
        const stsData = await stsRes.json();

        state.reports = repData.data || [];
        state.users = usrData.data || [];
        state.statuses = stsData.data || [];

        updateSelectors();
        renderAll();

    } catch (err) {
        if (tableBody) {
            tableBody.innerHTML = `<tr><td colspan="6" style="color:red;">Помилка: ${err.message}</td></tr>`;
        }
        console.error("Помилка:", err);
    }
}

function renderAll() {
    
    let filteredReports = [...state.reports].filter(r => {
        const title = (r.title || "").toLowerCase();
        
        const userObj = state.users.find(u => u.id == r.reporter_id);
        const author = (r.authorName || (userObj ? userObj.name : "")).toLowerCase();
        
        const s = state.search.toLowerCase();
        return (title.includes(s) || author.includes(s)) &&
               (!state.statusFilter || String(r.status_id) === state.statusFilter) &&
               (!state.sevFilter || r.severity === state.sevFilter);
    });

    if (state.sortOrder === "asc") filteredReports.sort((a, b) => severityRank[a.severity] - severityRank[b.severity]);
    if (state.sortOrder === "desc") filteredReports.sort((a, b) => severityRank[b.severity] - severityRank[a.severity]);

    const reportsHtml = filteredReports.map(r => {
        
        const user = state.users.find(u => u.id == r.reporter_id);
        const displayName = r.authorName || (user ? user.name : "Невідомий");

        return `
            <tr>
                <td>${r.title}</td>
                <td>${r.severity}</td>
                <td>${r.status_name || "Новий"}</td>
                <td>${r.description || "-"}</td>
                <td>${displayName}</td>
                <td>
                    <button onclick="window.editReport(${r.id})">Редагувати</button>
                    <button onclick="window.deleteReport(${r.id})">Видалити</button>
                </td>
            </tr>
        `;
    }).join("");
    
    const reportsTable = document.getElementById("reportsTableBody");
    if (reportsTable) reportsTable.innerHTML = reportsHtml || '<tr><td colspan="6">Звітів не знайдено</td></tr>';

  
    const usersTable = document.getElementById("usersTableBody");
    if (usersTable) {
        usersTable.innerHTML = state.users.map(u => `
            <tr>
                <td>${u.id}</td>
                <td>${u.name}</td>
                <td><button onclick="window.deleteUser('${u.id}')">Видалити</button></td>
            </tr>
        `).join("");
    }

    
    const statusesTable = document.getElementById("statusesTableBody");
    if (statusesTable) {
        statusesTable.innerHTML = state.statuses.map(s => `
            <tr>
                <td>${s.id}</td>
                <td>${s.name}</td>
                <td>${s.description || "-"}</td>
                <td><button onclick="window.deleteStatus(${s.id})">Видалити</button></td>
            </tr>
        `).join("");
    }
}


const reportForm = document.getElementById("reportForm");
if (reportForm) {
    reportForm.onsubmit = async (e) => {
        e.preventDefault();
        const editId = document.getElementById("editId").value;
        const uId = document.getElementById("userId").value;
        const uName = document.getElementById("userName").value;

        try {
            
            if (!editId && uId && uName) {
                await fetch(`${BASE_URL}/users`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: uId, name: uName })
                });
            }

            const reportData = {
                title: document.getElementById("title").value,
                severity: document.getElementById("severity").value,
                status_id: parseInt(document.getElementById("status").value),
                description: document.getElementById("description").value,
                reporter_id: uId
            };

            const url = editId ? `${BASE_URL}/reports/${editId}` : `${BASE_URL}/reports`;
            await fetch(url, {
                method: editId ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(reportData)
            });

            reportForm.reset();
            document.getElementById("editId").value = "";
            document.getElementById("submitBtn").textContent = "Додати";
            await loadAllData();
        } catch (err) { 
            console.error("Помилка форми:", err); 
        }
    };
}


window.editReport = (id) => {
    const r = state.reports.find(item => item.id == id);
    if (!r) return;
    document.getElementById("editId").value = r.id;
    document.getElementById("title").value = r.title;
    document.getElementById("severity").value = r.severity;
    document.getElementById("status").value = r.status_id;
    document.getElementById("description").value = r.description || "";
    document.getElementById("userId").value = r.reporter_id || "";
    
    const user = state.users.find(u => u.id == r.reporter_id);
    document.getElementById("userName").value = r.authorName || (user ? user.name : "");
    
    document.getElementById("submitBtn").textContent = "Зберегти зміни";
    window.scrollTo({ top: 0, behavior: "smooth" });
};

window.deleteReport = async (id) => { if (confirm("Видалити звіт?")) { await fetch(`${BASE_URL}/reports/${id}`, { method: "DELETE" }); await loadAllData(); } };
window.deleteUser = async (id) => { if (confirm("Видалити користувача?")) { await fetch(`${BASE_URL}/users/${id}`, { method: "DELETE" }); await loadAllData(); } };
window.deleteStatus = async (id) => { if (confirm("Видалити статус?")) { await fetch(`${BASE_URL}/statuses/${id}`, { method: "DELETE" }); await loadAllData(); } };


const bind = (id, evt, fn) => document.getElementById(id)?.addEventListener(evt, fn);
bind("searchInput", "input", (e) => { state.search = e.target.value; renderAll(); });
bind("filterStatus", "change", (e) => { state.statusFilter = e.target.value; renderAll(); });
bind("filterSeverity", "change", (e) => { state.sevFilter = e.target.value; renderAll(); });
bind("sortSelect", "change", (e) => { state.sortOrder = e.target.value; renderAll(); });
bind("resetFilters", "click", () => {
    state.search = ""; state.statusFilter = ""; state.sevFilter = ""; state.sortOrder = "";
    ["searchInput", "filterStatus", "filterSeverity", "sortSelect"].forEach(id => { 
        const el = document.getElementById(id);
        if (el) el.value = ""; 
    });
    renderAll();
});

function updateSelectors() {
    const stsOpts = state.statuses.map(s => `<option value="${s.id}">${s.name}</option>`).join("");
    const fSts = document.getElementById("filterStatus");
    if (fSts) fSts.innerHTML = '<option value="">Статус (усі)</option>' + stsOpts;
    const sSts = document.getElementById("status");
    if (sSts) sSts.innerHTML = '<option value="">Оберіть статус</option>' + stsOpts;
}


loadAllData();