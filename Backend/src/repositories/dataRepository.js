"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReportsWithAuthors = getReportsWithAuthors;
exports.getById = getById;
exports.add = add;
exports.update = update;
exports.remove = remove;
const dbClient_1 = require("../db/dbClient");
const Report_1 = require("../models/Report");
async function getReportsWithAuthors() {
    const sql = `
        SELECT r.*, s.name as status_name, u.name as authorName 
        FROM reports r 
        LEFT JOIN statuses s ON r.status_id = s.id 
        LEFT JOIN users u ON r.reporter_id = u.id
        ORDER BY r.createdAt DESC`;
    return await (0, dbClient_1.dbAll)(sql);
}
async function getById(id) {
    const sql = 'SELECT * FROM reports WHERE id = ?';
    const rows = await (0, dbClient_1.dbAll)(sql, [id]);
    return rows.length > 0 ? rows[0] : null;
}
async function add(r) {
    const createdAt = r.createdAt || new Date().toISOString();
    const sql = `
        INSERT INTO reports (title, severity, status_id, description, reporter_id, createdAt) 
        VALUES (?, ?, ?, ?, ?, ?)`;
    const params = [
        r.title || '',
        r.severity || 'Низький',
        r.status_id || 1,
        r.description || null,
        r.reporter_id || null,
        createdAt
    ];
    const result = await (0, dbClient_1.dbRun)(sql, params);
    return {
        id: result.id,
        title: r.title || '',
        severity: r.severity || 'Низький',
        status_id: r.status_id || 1,
        description: r.description || null,
        reporter_id: r.reporter_id || null,
        createdAt: createdAt
    };
}
async function update(id, data) {
    const current = await getById(id);
    if (!current)
        throw new Error("Report not found");
    const fields = Object.keys(data).filter(key => data[key] !== undefined);
    if (fields.length === 0)
        return current;
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const params = fields.map(field => data[field]);
    params.push(id);
    await (0, dbClient_1.dbRun)(`UPDATE reports SET ${setClause} WHERE id = ?`, params);
    return { ...current, ...data };
}
async function remove(id) {
    return await (0, dbClient_1.dbRun)('DELETE FROM reports WHERE id = ?', [id]);
}
//# sourceMappingURL=dataRepository.js.map