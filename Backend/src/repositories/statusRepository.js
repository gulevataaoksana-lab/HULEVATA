"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAll = getAll;
exports.getById = getById;
exports.add = add;
exports.update = update;
exports.remove = remove;
const dbClient_1 = require("../db/dbClient");
const Status_1 = require("../models/Status");
async function getAll() {
    return await (0, dbClient_1.dbAll)('SELECT * FROM statuses');
}
async function getById(id) {
    const rows = await (0, dbClient_1.dbAll)(`SELECT * FROM statuses WHERE id = ${id}`);
    return rows[0] || null;
}
async function add(name, description) {
    const sql = `INSERT INTO statuses (name, description) VALUES ('${name}', '${description || ''}')`;
    const result = await (0, dbClient_1.dbRun)(sql);
    return {
        id: result.id,
        name,
        description: description || null
    };
}
async function update(id, name, description) {
    const sql = `INSERT INTO statuses (name, description) VALUES (?, ?)`;
    const result = await (0, dbClient_1.dbRun)(sql, [name, description || '']);
    if (result.changes === 0) {
        throw new Error("Статус не знайдено для оновлення");
    }
    return { id, name, description: description || null };
}
async function remove(id) {
    const result = await (0, dbClient_1.dbRun)(`DELETE FROM statuses WHERE id = ${id}`);
    return { id, changes: result.changes };
}
//# sourceMappingURL=statusRepository.js.map