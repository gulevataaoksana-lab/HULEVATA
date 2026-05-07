"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
exports.dbAll = dbAll;
exports.dbRun = dbRun;
exports.runMigrations = runMigrations;
const sqlite3_1 = __importDefault(require("sqlite3"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dbPath = path_1.default.join(__dirname, '../../data/database.db');
const dbDir = path_1.default.dirname(dbPath);
if (!fs_1.default.existsSync(dbDir))
    fs_1.default.mkdirSync(dbDir, { recursive: true });
exports.db = new sqlite3_1.default.Database(dbPath);
exports.db.run("PRAGMA foreign_keys = ON");
function dbAll(sql, params = []) {
    return new Promise(function (resolve, reject) {
        exports.db.all(sql, params, function (err, rows) {
            if (err)
                reject(err);
            else
                resolve(rows);
        });
    });
}
function dbRun(sql, params = []) {
    return new Promise(function (resolve, reject) {
        exports.db.run(sql, params, function (err) {
            if (err)
                reject(err);
            else
                resolve({ id: this.lastID, changes: this.changes });
        });
    });
}
async function runMigrations() {
    await dbRun("CREATE TABLE IF NOT EXISTS schema_migrations (id INTEGER PRIMARY KEY, migration_name TEXT UNIQUE)");
    const migrationsDir = path_1.default.join(__dirname, '../migrations');
    if (!fs_1.default.existsSync(migrationsDir))
        return;
    const files = fs_1.default.readdirSync(migrationsDir).sort();
    for (const file of files) {
        if (!file.endsWith('.sql'))
            continue;
        const applied = await dbAll("SELECT * FROM schema_migrations WHERE migration_name = ?", [file]);
        if (applied.length === 0) {
            const sql = fs_1.default.readFileSync(path_1.default.join(migrationsDir, file), 'utf8');
            const queries = sql.split(';').filter(q => q.trim() !== '');
            for (const query of queries)
                await dbRun(query);
            await dbRun("INSERT INTO schema_migrations (migration_name) VALUES (?)", [file]);
            console.log("Applied migration: " + file);
        }
    }
}
//# sourceMappingURL=dbClient.js.map