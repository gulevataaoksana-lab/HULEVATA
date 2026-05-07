export declare function getAllStatuses(): Promise<import("../models/Status").Status[]>;
export declare function getStatusById(id: number): Promise<import("../models/Status").Status>;
export declare function createStatus(name: string, description?: string): Promise<import("../models/Status").Status>;
export declare function updateStatus(id: number, name: string, description?: string | null): Promise<import("../models/Status").Status>;
export declare function deleteStatus(id: number): Promise<{
    message: string;
}>;
//# sourceMappingURL=statusService.d.ts.map