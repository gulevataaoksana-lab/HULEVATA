let reports: any[] = [];
export function getAll() {
    return reports;
}
export function add(data: any) {
    const newReport = { 
        id: Date.now().toString(), 
        ...data 
    };
    reports.push(newReport);
    return newReport;
}
export function update(id: string, data: any) {
    const index = reports.findIndex(function(r) {
        return r.id == id;
    });  
    if (index === -1) return null;  
    reports[index] = { 
        ...reports[index], 
        ...data, 
        id: id.toString() 
    };
    return reports[index];
}
export function remove(id: string) {
    const index = reports.findIndex(function(r) {
        return r.id == id;
    });
    if (index === -1) return false;
    reports.splice(index, 1);
    return true;
}