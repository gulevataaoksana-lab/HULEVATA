"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAll = getAll;
exports.getById = getById;
exports.add = add;
exports.update = update;
exports.remove = remove;
const dbClient_1 = require("../db/dbClient");
async function getAll() {
    return await (0, dbClient_1.dbAll)('SELECT * FROM users');
}
async function getById(id) {
    const rows = await (0, dbClient_1.dbAll)('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0] || null;
}
async function add(id, name) {
    await (0, dbClient_1.dbRun)('INSERT INTO users (id, name) VALUES (?, ?)', [id, name]);
    return { id, name };
}
async function update(id, name) {
    await (0, dbClient_1.dbRun)('UPDATE users SET name = ? WHERE id = ?', [name, id]);
    return { id, name };
}
async function remove(id) {
    const result = await (0, dbClient_1.dbRun)('DELETE FROM users WHERE id = ?', [id]);
    return result.changes > 0;
}
//# sourceMappingURL=userRepository.js.map