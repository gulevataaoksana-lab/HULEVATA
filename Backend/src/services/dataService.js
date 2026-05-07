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
Object.defineProperty(exports, "__esModule", { value: true });
exports.importReports = void 0;
exports.getAllReports = getAllReports;
exports.getReportById = getReportById;
exports.createReport = createReport;
exports.updateReport = updateReport;
exports.deleteReport = deleteReport;
const repo = __importStar(require("../repositories/dataRepository"));
const userRepo = __importStar(require("../repositories/userRepository"));
const AppError_1 = require("../errors/AppError");
const Report_1 = require("../models/Report");
async function getAllReports() {
    return await repo.getReportsWithAuthors();
}
async function getReportById(id) {
    const report = await repo.getById(id);
    if (!report) {
        throw new AppError_1.AppError("Звіт з таким ID не знайдено", 404, 'NOT_FOUND');
    }
    return report;
}
async function createReport(data) {
    const { title, severity, status_id, reporter_id, authorName, description } = data;
    if (!title || !reporter_id || !authorName) {
        throw new AppError_1.AppError("Назва, ID автора та ім'я є обов'язковими", 400, 'VALIDATION_ERROR');
    }
    const existingUser = await userRepo.getById(reporter_id);
    if (!existingUser) {
        await userRepo.add(reporter_id, authorName);
    }
    const newReport = {
        title,
        severity: severity || 'Низький',
        status_id: status_id || 1,
        description: description || '',
        reporter_id,
        createdAt: new Date().toISOString()
    };
    return await repo.add(newReport);
}
const importReports = async (data) => {
    for (const item of data) {
        await repo.add({
            ...item,
            createdAt: new Date().toISOString()
        });
    }
};
exports.importReports = importReports;
async function updateReport(id, data) {
    const existing = await repo.getById(id);
    if (!existing) {
        throw new AppError_1.AppError("Звіт не знайдено ", 404, 'NOT_FOUND');
    }
    return await repo.update(id, data);
}
async function deleteReport(id) {
    const result = await repo.remove(id);
    if (result.changes === 0) {
        throw new AppError_1.AppError("Не вдалося видалити звіт ", 404, 'DELETE_FAILED');
    }
}
//# sourceMappingURL=dataService.js.map