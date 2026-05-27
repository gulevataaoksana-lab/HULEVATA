export interface Status {
    id: number;
    name: string;
    description?: string | null;
}

export interface User {
    id: string;
    name: string;
}

export interface Report {
    id: number | string;
    title: string;
    severity: string;
    status_id: number;
    description?: string | null;
    reporter_id?: string; 
    authorName?: string;  
    createdAt?: string;
}

export interface CreateReportDto {
    title: string;
    severity: string;
    status_id: number;
    description?: string;
}