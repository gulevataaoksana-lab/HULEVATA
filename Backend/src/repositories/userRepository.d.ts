export interface User {
    id: string;
    name: string;
}
export declare function getAll(): Promise<User[]>;
export declare function getById(id: string): Promise<User | null>;
export declare function add(id: string, name: string): Promise<User>;
export declare function update(id: string, name: string): Promise<User>;
export declare function remove(id: string): Promise<boolean>;
//# sourceMappingURL=userRepository.d.ts.map