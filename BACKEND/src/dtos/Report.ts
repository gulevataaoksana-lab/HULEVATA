export interface CreateReportDto {
    title: string;
    content: string;
    severity?: string;
}
export interface UpdateReportDto {
    title?: string;
    content?: string;
    severity?: string;
}