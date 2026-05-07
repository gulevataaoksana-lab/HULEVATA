"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
function logger(req, res, next) {
    const start = Date.now();
    const { method, url } = req;
    res.on('finish', () => {
        const duration = Date.now() - start;
        const status = res.statusCode;
        console.log(`[${new Date().toISOString()}] ${method} ${url} | Status: ${status} | ${duration}ms`);
    });
    next();
}
exports.default = logger;
//# sourceMappingURL=logger.js.map