import * as repo from '../repositories/dataRepository';
import { CreateReportDto, UpdateReportDto } from '../dtos/Report';
export function getAllReports() {
    return repo.getAll();
}
export function createReport(data: CreateReportDto) {
    return repo.add(data);
}
export function updateReport(id: string, data: UpdateReportDto) {
    return repo.update(id, data);
}
export function deleteReport(id: string) {
    return repo.remove(id);
}