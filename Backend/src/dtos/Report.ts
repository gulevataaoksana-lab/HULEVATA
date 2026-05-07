export interface CreateReportDto {
    title: string;
    severity: 'Низький' | 'Середній' | 'Високий' | 'Критичний';
    status_id: number;
    reporter_id: string; 
    authorName: string;   
    description?: string;
}

export interface UpdateReportDto {
    title?: string;
    severity?: 'Низький' | 'Середній' | 'Високий' | 'Критичний';
    status_id?: number;
    description?: string;
}