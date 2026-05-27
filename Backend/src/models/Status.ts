export interface Status {
    id: number;
    name: string;
    description: string | null;
}

export interface CreateStatusDto {
    name: string;
    description?: string; 
}

export type UpdateStatusDto = Partial<CreateStatusDto>;