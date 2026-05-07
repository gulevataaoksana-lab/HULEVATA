"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importStar(require("express"));
const cors_1 = __importDefault(require("cors"));
const dbClient_1 = require("./db/dbClient");
const dataRoutes_1 = __importDefault(require("./routes/dataRoutes"));
const statusRoutes_1 = __importDefault(require("./routes/statusRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const AppError_1 = require("./errors/AppError");
const logger_1 = __importDefault(require("./middleware/./logger"));
const app = (0, express_1.default)();
app.use(logger_1.default);
app.use((0, cors_1.default)({
    origin: ['http://localhost:5500', 'http://127.0.0.1:5500'],
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
app.use(express_1.default.json());
app.use('/api/v1/reports', dataRoutes_1.default);
app.use('/api/v1/statuses', statusRoutes_1.default);
app.use('/api/v1/users', userRoutes_1.default);
app.get('/', (req, res) => res.send('API працює '));
app.use((err, req, res, next) => {
    const statusCode = err instanceof AppError_1.AppError ? err.statusCode : 500;
    const errorCode = err instanceof AppError_1.AppError ? err.code : 'INTERNAL_SERVER_ERROR';
    console.error(`[ERROR] ${req.method} ${req.url} - ${err.message}`);
    res.status(statusCode).json({
        status: statusCode,
        title: errorCode,
        detail: err.message || 'Внутрішня помилка сервера',
        instance: req.url,
        timestamp: new Date().toISOString()
    });
});
const PORT = 3000;
app.listen(PORT, async () => {
    try {
        await (0, dbClient_1.runMigrations)();
        console.log(`Сервер запущено: http://localhost:${PORT}`);
    }
    catch (err) {
        console.error('Помилка міграцій:', err);
    }
});
//# sourceMappingURL=index.js.map