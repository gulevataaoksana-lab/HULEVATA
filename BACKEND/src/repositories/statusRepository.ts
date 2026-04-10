import { dbAll, dbRun } from '../db/dbClient';
export async function getAll() {
    return await dbAll('SELECT * FROM statuses');
}
export async function getById(id: string) {
    const sql = "SELECT * FROM statuses WHERE id = " + id;
    return await dbAll(sql);
}
export async function add(name: string) {
    const sql = "INSERT INTO statuses (name) VALUES ('" + name + "')";
    const result = await dbRun(sql);
    return { 
        id: (result as any).id, 
        name: name 
    };
}
export async function update(id: string, name: string) {
    const sql = "UPDATE statuses SET name = '" + name + "' WHERE id = " + id;
    await dbRun(sql);
    return { 
        id: id, 
        name: name 
    };
}
export async function remove(id: string) {
    const sql = "DELETE FROM statuses WHERE id = " + id;
    await dbRun(sql);
    return true;
}
