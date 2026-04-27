export class AppError extends Error {
    public statusCode: number;
    public code: string;
    public details: any[] | null;
    constructor(message: string, statusCode: number, code: string = 'ERROR', details: any[] | null = null) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.details = details;
        Object.setPrototypeOf(this, AppError.prototype);
    }
}
