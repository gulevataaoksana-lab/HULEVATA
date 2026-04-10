import { dbAll, dbRun } from '../db/dbClient';
export async function getAll() {
    return await dbAll('SELECT * FROM items');
}
export async function getById(id: string) {
    return await dbAll(`SELECT * FROM items WHERE id = ${id}`);
}
export async function add(data: any) {
    const createdAt = new Date().toISOString();
    const sql = `INSERT INTO items (title, statusId, ownerId, priority, createdAt) 
                 VALUES ('${data.title}', ${data.statusId}, '${data.ownerId}', ${data.priority || 0}, '${createdAt}')`;

    const result = await dbRun(sql);
    return { id: (result as any).id, ...data, createdAt };
}
export async function update(id: string, data: any) {
    const sql = `UPDATE items 
                 SET title = '${data.title}', 
                     statusId = ${data.statusId}, 
                     priority = ${data.priority} 
                 WHERE id = ${id}`;
    await dbRun(sql);
    return { id, ...data };
}
export async function remove(id: string) {
    const sql = `DELETE FROM items WHERE id = ${id}`;
    await dbRun(sql);
    return true;
}
