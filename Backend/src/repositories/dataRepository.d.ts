import { Report, UpdateReportDto } from '../models/Report';
export declare function getReportsWithAuthors(): Promise<Report[]>;
export declare function getById(id: number): Promise<Report | null>;
export declare function add(r: Partial<Report>): Promise<Report>;
export declare function update(id: number, data: UpdateReportDto): Promise<Report>;
export declare function remove(id: number): Promise<{
    id: number;
    changes: number;
}>;
//# sourceMappingURL=dataRepository.d.ts.map