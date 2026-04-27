export interface Report {
    id: number;
    title: string;
    severity: string;
    status_id: number;
    reporter_id: string | null;
    description: string | null;
    createdAt: string;
}
