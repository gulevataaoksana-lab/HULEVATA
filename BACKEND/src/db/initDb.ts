import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';

const db = new sqlite3.Database('./database.db');

export function dbAll(sql: string, params: any[] = []): Promise<any[]> {
    return new Promise(function(resolve, reject) {
        db.all(sql, params, function(err, rows) {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}
export function dbRun(sql: string, params: any[] = []): Promise<any> {
    return new Promise(function(resolve, reject) {
        db.run(sql, params, function(this: any, err: Error | null) {
            if (err) {
                reject(err);
            } else {
                resolve({ id: this.lastID, changes: this.changes });
            }
        });
    });
}

export async function runMigrations() {
    await dbRun("CREATE TABLE IF NOT EXISTS schema_migrations (id INTEGER PRIMARY KEY, migration_name TEXT UNIQUE)");
    const migrationsDir = path.join(__dirname, '../migrations');
    if (!fs.existsSync(migrationsDir)) {
        fs.mkdirSync(migrationsDir, { recursive: true });
    }
    const files = fs.readdirSync(migrationsDir).sort();
    for (const file of files) {
        if (file.endsWith('.sql')) {
            const applied = await dbAll("SELECT * FROM schema_migrations WHERE migration_name = ?", [file]);
            if (applied.length === 0) {
                const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
                const queries = sql.split(';').filter(function(q) { return q.trim() !== ''; });
                for (const query of queries) {
                    await dbRun(query);
                }
                await dbRun("INSERT INTO schema_migrations (migration_name) VALUES (?)", [file]);
                console.log("Застосовано: " + file);
            }
        }
    }
}
