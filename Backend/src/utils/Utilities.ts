export function isEmpty(value: unknown): boolean {
    if (typeof value === 'string') return value.trim().length === 0;
    return value === null || value === undefined;
}

export function formatResponse<T>(data: T, message: string = 'Успішно') {
    return {
        success: true,
        message: message,
        data: data,
        timestamp: new Date().toISOString()
    };
}