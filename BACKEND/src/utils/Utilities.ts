export function isEmpty(value: string | undefined | null): boolean {
    return !value || value.trim().length === 0;
}
export function isValidId(id: string): boolean {
    return id.length > 0;
}
export function formatResponse(data: any, message: string = 'Success') {
    return {
        status: 'success',
        message: message,
        data: data,
        timestamp: new Date().toISOString()
    };
}
