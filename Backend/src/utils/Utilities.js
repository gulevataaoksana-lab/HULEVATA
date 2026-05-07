"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEmpty = isEmpty;
exports.formatResponse = formatResponse;
function isEmpty(value) {
    if (typeof value === 'string')
        return value.trim().length === 0;
    return value === null || value === undefined;
}
function formatResponse(data, message = 'Успішно') {
    return {
        success: true,
        message: message,
        data: data,
        timestamp: new Date().toISOString()
    };
}
//# sourceMappingURL=Utilities.js.map