import { Report, CreateReportDto, UpdateReportDto } from '../models/Report';
export declare function getAllReports(): Promise<Report[]>;
export declare function getReportById(id: number): Promise<Report>;
export declare function createReport(data: CreateReportDto): Promise<Report>;
export declare const importReports: (data: any[]) => Promise<void>;
export declare function updateReport(id: number, data: UpdateReportDto): Promise<Report>;
export declare function deleteReport(id: number): Promise<void>;
//# sourceMappingURL=dataService.d.ts.map