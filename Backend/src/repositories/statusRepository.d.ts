import { Status } from '../models/Status';
export declare function getAll(): Promise<Status[]>;
export declare function getById(id: number): Promise<Status | null>;
export declare function add(name: string, description?: string): Promise<Status>;
export declare function update(id: number, name: string, description?: string | null): Promise<Status>;
export declare function remove(id: number): Promise<{
    id: number;
    changes: number;
}>;
//# sourceMappingURL=statusRepository.d.ts.map