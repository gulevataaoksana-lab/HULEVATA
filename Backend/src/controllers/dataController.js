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
exports.getReports = getReports;
exports.getReportById = getReportById;
exports.createReport = createReport;
exports.updateReport = updateReport;
exports.deleteReport = deleteReport;
exports.importReports = importReports;
const express_1 = require("express");
const service = __importStar(require("../services/dataService"));
const Utilities_1 = require("../utils/Utilities");
const AppError_1 = require("../errors/AppError");
const Report_1 = require("../models/Report");
async function getReports(req, res, next) {
    try {
        let reports = await service.getAllReports();
        const statusFilter = req.query.status_id;
        if (statusFilter) {
            reports = reports.filter(r => r.status_id === Number(statusFilter));
        }
        const sortBy = req.query.sort;
        if (sortBy === 'title') {
            reports.sort((a, b) => a.title.localeCompare(b.title, 'uk'));
        }
        res.status(200).json((0, Utilities_1.formatResponse)(reports, 'Список звітів отримано'));
    }
    catch (error) {
        next(error);
    }
}
async function getReportById(req, res, next) {
    try {
        const id = Number(req.params.id);
        if (isNaN(id))
            throw new AppError_1.AppError("Некоректний ID", 400, 'INVALID_ID');
        const report = await service.getReportById(id);
        res.status(200).json((0, Utilities_1.formatResponse)(report, 'Звіт знайдено'));
    }
    catch (error) {
        next(error);
    }
}
async function createReport(req, res, next) {
    try {
        const body = req.body;
        if ((0, Utilities_1.isEmpty)(body.title)) {
            throw new AppError_1.AppError("Назва звіту не може бути порожньою", 400, 'VALIDATION_ERROR');
        }
        const newReport = await service.createReport(body);
        res.status(201).json((0, Utilities_1.formatResponse)(newReport, 'Звіт успішно створено'));
    }
    catch (error) {
        next(error);
    }
}
async function updateReport(req, res, next) {
    try {
        const id = Number(req.params.id);
        const body = req.body;
        if (isNaN(id))
            throw new AppError_1.AppError("Некоректний ID для оновлення", 400, 'INVALID_ID');
        const updated = await service.updateReport(id, body);
        res.status(200).json((0, Utilities_1.formatResponse)(updated, 'Звіт оновлено'));
    }
    catch (error) {
        next(error);
    }
}
async function deleteReport(req, res, next) {
    try {
        const id = Number(req.params.id);
        if (isNaN(id))
            throw new AppError_1.AppError("Некоректний ID для видалення", 400, 'INVALID_ID');
        await service.deleteReport(id);
        res.status(200).json((0, Utilities_1.formatResponse)(null, 'Звіт видалено'));
    }
    catch (error) {
        next(error);
    }
}
async function importReports(req, res, next) {
    try {
        const items = req.body;
        if (!Array.isArray(items)) {
            throw new AppError_1.AppError("Дані повинні бути масивом", 400, 'INVALID_FORMAT');
        }
        await service.importReports(items);
        res.status(201).json((0, Utilities_1.formatResponse)(null, `Імпортовано ${items.length} записів`));
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=dataController.js.map