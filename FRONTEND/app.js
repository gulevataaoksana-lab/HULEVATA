const form=document.getElementById("reportForm");
const clearBtn=document.getElementById("clearBtn");
const submitBtn=document.getElementById("submitBtn");
const titleInput=document.getElementById("title");
const severitySelect=document.getElementById("severity");
const statusSelect=document.getElementById("status");
const descriptionInput=document.getElementById("description");
const reporterInput=document.getElementById("reporter");
const editIdInput=document.getElementById("editId");
const titleError=document.getElementById("titleError");
const severityError=document.getElementById("severityError");
const statusError=document.getElementById("statusError");
const descriptionError=document.getElementById("descriptionError");
const reporterError=document.getElementById("reporterError");
const tbody=document.getElementById("reportsTableBody");
const searchInput=document.getElementById("searchInput");
const filterStatus=document.getElementById("filterStatus");
const filterSeverity=document.getElementById("filterSeverity");
const sortSelect=document.getElementById("sortSelect");
const clearFiltersBtn=document.getElementById("clearFiltersBtn");
const STORAGE_KEY="v6_reports";
const severityRank={"Низький":1,"Середній":2,"Високий":3,"Критичний":4};
let state={reports:[],search:"",statusFilter:"",sevFilter:"",sort:""};
function uid(){if(window.crypto&&crypto.randomUUID)return crypto.randomUUID();return String(Date.now())+"_"+Math.random().toString(16).slice(2)}
function save(){localStorage.setItem(STORAGE_KEY,JSON.stringify(state.reports))}
function load(){const raw=localStorage.getItem(STORAGE_KEY);if(!raw)return;try{const arr=JSON.parse(raw);if(Array.isArray(arr))state.reports=arr}catch(_){}}
function escapeHtml(s){return String(s).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;")}
function setError(el,msg){el.textContent=msg}
function markInvalid(input,isInvalid){input.classList.toggle("invalid",isInvalid)}
function clearErrors(){
  setError(titleError,"");setError(severityError,"");setError(statusError,"");setError(descriptionError,"");setError(reporterError,"");
  markInvalid(titleInput,false);markInvalid(severitySelect,false);markInvalid(statusSelect,false);markInvalid(descriptionInput,false);markInvalid(reporterInput,false)
}
function readForm(){
  return{
    title:titleInput.value.trim(),
    severity:severitySelect.value,
    status:statusSelect.value,
    description:descriptionInput.value.trim(),
    reporter:reporterInput.value.trim()
  }
}
function validate(data){
  clearErrors();
  let ok=true;
  if(!data.title){setError(titleError,"Назва обов’язкова.");markInvalid(titleInput,true);ok=false}
  if(!data.severity){setError(severityError,"Оберіть критичність.");markInvalid(severitySelect,true);ok=false}
  if(!data.status){setError(statusError,"Оберіть статус.");markInvalid(statusSelect,true);ok=false}
  if(!data.description){setError(descriptionError,"Опис обов’язковий.");markInvalid(descriptionInput,true);ok=false}
  if(!data.reporter){setError(reporterError,"Автор обов’язковий.");markInvalid(reporterInput,true);ok=false}
  return ok
}
function clearForm(){
  titleInput.value="";severitySelect.value="";statusSelect.value="";descriptionInput.value="";reporterInput.value="";
  editIdInput.value="";submitBtn.textContent="Додати";clearErrors()
}
function getView(){
  let arr=[...state.reports];
  const q=state.search.toLowerCase();
  if(q){arr=arr.filter(r=>r.title.toLowerCase().includes(q)||r.reporter.toLowerCase().includes(q))}
  if(state.statusFilter){arr=arr.filter(r=>r.status===state.statusFilter)}
  if(state.sevFilter){arr=arr.filter(r=>r.severity===state.sevFilter)}
  if(state.sort==="severityDesc"){arr.sort((a,b)=>severityRank[b.severity]-severityRank[a.severity])}
  else if(state.sort==="severityAsc"){arr.sort((a,b)=>severityRank[a.severity]-severityRank[b.severity])}
  else if(state.sort==="titleAsc"){arr.sort((a,b)=>a.title.localeCompare(b.title,"uk"))}
  else if(state.sort==="titleDesc"){arr.sort((a,b)=>b.title.localeCompare(a.title,"uk"))}
  return arr
}
function render(){
  const view=getView();
  tbody.innerHTML=view.map(r=>`<tr data-id="${r.id}">
    <td>${escapeHtml(r.title)}</td>
    <td>${escapeHtml(r.severity)}</td>
    <td>${escapeHtml(r.status)}</td>
    <td>${escapeHtml(r.description)}</td>
    <td>${escapeHtml(r.reporter)}</td>
    <td>
      <button type="button" class="editBtn">Редагувати</button>
      <button type="button" class="deleteBtn">Видалити</button>
    </td>
  </tr>`).join("")
}
function addReport(data){state.reports.push({id:uid(),...data});save()}
function updateReport(id,data){const idx=state.reports.findIndex(r=>r.id===id);if(idx===-1)return;state.reports[idx]={...state.reports[idx],...data};save()}
function deleteReport(id){state.reports=state.reports.filter(r=>r.id!==id);save()}
function fillFormForEdit(report){
  titleInput.value=report.title;
  severitySelect.value=report.severity;
  statusSelect.value=report.status;
  descriptionInput.value=report.description;
  reporterInput.value=report.reporter;
  editIdInput.value=report.id;
  submitBtn.textContent="Зберегти";
  titleInput.focus()
}
clearBtn.addEventListener("click",clearForm);
form.addEventListener("submit",e=>{
  e.preventDefault();
  const data=readForm();
  if(!validate(data))return;
  const editId=editIdInput.value;
  if(editId)updateReport(editId,data);
  else addReport(data);
  render();
  clearForm()
});
tbody.addEventListener("click",e=>{
  const btn=e.target.closest("button");if(!btn)return;
  const row=btn.closest("tr");if(!row)return;
  const id=row.dataset.id;
  if(btn.classList.contains("deleteBtn")){deleteReport(id);render();if(editIdInput.value===id)clearForm()}
  if(btn.classList.contains("editBtn")){const report=state.reports.find(r=>r.id===id);if(report)fillFormForEdit(report)}
});
function syncFilters(){
  state.search=searchInput.value.trim();
  state.statusFilter=filterStatus.value;
  state.sevFilter=filterSeverity.value;
  state.sort=sortSelect.value;
  render()
}
searchInput.addEventListener("input",syncFilters);
filterStatus.addEventListener("change",syncFilters);
filterSeverity.addEventListener("change",syncFilters);
sortSelect.addEventListener("change",syncFilters);
clearFiltersBtn.addEventListener("click",()=>{
  searchInput.value="";
  filterStatus.value="";
  filterSeverity.value="";
  sortSelect.value="";
  syncFilters()
});
load();
render();