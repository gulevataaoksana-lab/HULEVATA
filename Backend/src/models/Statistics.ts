export interface IStatisticsRequest {
    severity: string;
    statusId: string;
}

export interface ISeverityStat {
    severity: string;
    status_id: number;
    count: number;
}