export {}; 
interface User { id: string; name: string; }
interface Status { id: number; name: string; description?: string; }
interface Report {
    id?: number;
    title: string;
    severity: string;
    status_id: number;
    status_name?: string;
    description: string;
    reporter_id: string;
    authorName?: string;
    createdAt?: string;
}

interface AppState {
    reports: Report[];
    users: User[];
    statuses: Status[];
    search: string;
    statusFilter: string;
    sevFilter: string;
    sortOrder: string;
}


declare global {
    interface Window {
        editReport: (id: number) => void;
        deleteReport: (id: number) => void;
        deleteUser: (id: string) => void;
        deleteStatus: (id: number) => void;
    }
}

const BASE_URL = "http://localhost:3000/api/v1";

const severityRank: any = { 
    "Низький": 1, "Середній": 2, "Високий": 3, "Критичний": 4 
};

let state: AppState = { 
    reports: [], users: [], statuses: [], 
    search: "", statusFilter: "", sevFilter: "", sortOrder: "" 
};


function getVal(id: string): string {
    const el = document.getElementById(id) as any;
    return el ? el.value : "";
}

async function loadAllData() {
    const tableBody = document.getElementById("reportsTableBody") as any;
    if (!tableBody) return;
    
    tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Завантаження</td></tr>';

   
    const controller = new AbortController(); 
    const timer = setTimeout(() => controller.abort(), 10000);
  

    try {
        const [repRes, usrRes, stsRes] = await Promise.all([
            fetch(`${BASE_URL}/reports`, { signal: controller.signal }),
            fetch(`${BASE_URL}/users`, { signal: controller.signal }),
            fetch(`${BASE_URL}/statuses`, { signal: controller.signal })
        ]);
        
        clearTimeout(timer); 
        
    } catch (err: any) {
        tableBody.innerHTML = `<tr><td colspan="6" style="color:red;">Помилка з'єднання </td></tr>`;
    }
}
function renderAll() {
    const reportsBody = document.getElementById("reportsTableBody") as any;
    if (!reportsBody) return;

    let filtered = [...state.reports].filter(r => {
        const s = state.search.toLowerCase();
        const matchesSearch = (r.title || "").toLowerCase().includes(s) || (r.authorName || "").toLowerCase().includes(s);
        const matchesStatus = !state.statusFilter || String(r.status_id) === state.statusFilter;
        const matchesSev = !state.sevFilter || r.severity === state.sevFilter;
        return matchesSearch && matchesStatus && matchesSev;
    });

    if (state.sortOrder === "asc") filtered.sort((a, b) => severityRank[a.severity] - severityRank[b.severity]);
    if (state.sortOrder === "desc") filtered.sort((a, b) => severityRank[b.severity] - severityRank[a.severity]);

    reportsBody.innerHTML = filtered.map(r => `
        <tr>
            <td>${r.title}</td>
            <td>${r.severity}</td>
            <td>${r.status_name || "Новий"}</td>
            <td>${r.description || "-"}</td>
            <td>${r.authorName || "Анонім"}</td>
            <td>
                <button onclick="window.editReport(${Number(r.id)})">Редагувати</button>
                <button onclick="window.deleteReport(${Number(r.id)})">Видалити</button>
            </td>
        </tr>
    `).join("");

    const uBody = document.getElementById("usersTableBody") as any;
    if (uBody) uBody.innerHTML = state.users.map(u => `<tr><td>${u.id}</td><td>${u.name}</td><td><button onclick="window.deleteUser('${u.id}')">Видалити</button></td></tr>`).join("");
    
    const sBody = document.getElementById("statusesTableBody") as any;
    if (sBody) sBody.innerHTML = state.statuses.map(s => `<tr><td>${s.id}</td><td>${s.name}</td><td>${s.description || "-"}</td><td><button onclick="window.deleteStatus(${Number(s.id)})">Видалити</button></td></tr>`).join("");
}

const reportForm = document.getElementById("reportForm") as any;
if (reportForm) {
    reportForm.onsubmit = async (e: any) => {
        e.preventDefault();
        const editId = getVal("editId");
        const uId = getVal("userId");
        const uName = getVal("userName");

        try {
            if (!editId) {
                await fetch(`${BASE_URL}/users`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: uId, name: uName })
                });
            }

            const reportData: Report = {
                title: getVal("title"),
                severity: getVal("severity"),
                status_id: parseInt(getVal("status")),
                description: getVal("description"),
                reporter_id: uId,
                createdAt: new Date().toISOString()
            };

            const url = editId ? `${BASE_URL}/reports/${editId}` : `${BASE_URL}/reports`;
            await fetch(url, {
                method: editId ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(reportData)
            });

            reportForm.reset();
            const editIdInput = document.getElementById("editId") as any;
            if (editIdInput) editIdInput.value = "";
            const submitBtn = document.getElementById("submitBtn") as any;
            if (submitBtn) submitBtn.textContent = "Додати";
            await loadAllData();
        } catch (err) { console.error(err); }
    };
}

window.editReport = (id: number) => {
    const r = state.reports.find(item => item.id == id);
    if (!r) return;
    (document.getElementById("editId") as any).value = r.id;
    (document.getElementById("title") as any).value = r.title;
    (document.getElementById("severity") as any).value = r.severity;
    (document.getElementById("status") as any).value = r.status_id;
    (document.getElementById("description") as any).value = r.description;
    (document.getElementById("userId") as any).value = r.reporter_id;
    (document.getElementById("userName") as any).value = r.authorName;
    (document.getElementById("submitBtn") as any).textContent = "Зберегти зміни";
    window.scrollTo({ top: 0, behavior: "smooth" });
};

window.deleteReport = async (id: number) => { if (confirm("Видалити?")) { await fetch(`${BASE_URL}/reports/${id}`, { method: "DELETE" }); await loadAllData(); } };
window.deleteUser = async (id: string) => { if (confirm("Видалити?")) { await fetch(`${BASE_URL}/users/${id}`, { method: "DELETE" }); await loadAllData(); } };
window.deleteStatus = async (id: number) => { if (confirm("Видалити?")) { await fetch(`${BASE_URL}/statuses/${id}`, { method: "DELETE" }); await loadAllData(); } };

const bind = (id: string, evt: string, fn: any) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener(evt, fn);
};

bind("searchInput", "input", (e: any) => { state.search = e.target.value; renderAll(); });
bind("filterStatus", "change", (e: any) => { state.statusFilter = e.target.value; renderAll(); });
bind("filterSeverity", "change", (e: any) => { state.sevFilter = e.target.value; renderAll(); });
bind("sortSelect", "change", (e: any) => { state.sortOrder = e.target.value; renderAll(); });
bind("resetFilters", "click", () => {
    state.search = ""; state.statusFilter = ""; state.sevFilter = ""; state.sortOrder = "";
    loadAllData();
});

function updateSelectors() {
    const stsOpts = state.statuses.map(s => `<option value="${s.id}">${s.name}</option>`).join("");
    const fSts = document.getElementById("filterStatus") as any;
    const sSts = document.getElementById("status") as any;
    if (fSts) fSts.innerHTML = '<option value="">Статус (усі)</option>' + stsOpts;
    if (sSts) sSts.innerHTML = '<option value="">Оберіть статус</option>' + stsOpts;
}

loadAllData();