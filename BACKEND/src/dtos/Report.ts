export interface CreateReportDto {
    title: string;
    severity: string;  
    status: string;    
    reporter: string;  
    description: string; 
}
export interface UpdateReportDto {
    title: string;
    severity: string;
    status: string;
    reporter: string;
    description: string;
}
