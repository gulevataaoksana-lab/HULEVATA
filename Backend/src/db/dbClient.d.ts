import sqlite3 from 'sqlite3';
export declare const db: sqlite3.Database;
export declare function dbAll<T>(sql: string, params?: (string | number | null)[]): Promise<T[]>;
export declare function dbRun(sql: string, params?: (string | number | null)[]): Promise<{
    id: number;
    changes: number;
}>;
export declare function runMigrations(): Promise<void>;
//# sourceMappingURL=dbClient.d.ts.map