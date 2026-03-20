export const isEmpty = (value: string | undefined | null): boolean => {
    return !value || value.trim().length === 0;
};
export const isValidId = (id: string): boolean => {
    return id.length > 0;
};
export const formatResponse = (data: any, message: string = 'Success') => {
    return {
        status: 'success',
        message,
        data,
        timestamp: new Date().toISOString()
    };
};