export interface Report {
    id: number;
    title: string;
    severity: string;
    status_id: number;
    description: string | null;
    reporter_id: string | null;
    createdAt: string;
    status_name?: string;
    authorName?: string;
}

export interface CreateReportDto {
    title: string;
    severity?: string;
    status_id?: number;
    description?: string;
    reporter_id: string;
    authorName: string;
}

export type UpdateReportDto = Partial<CreateReportDto>;