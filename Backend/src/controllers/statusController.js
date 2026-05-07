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
exports.getStatuses = getStatuses;
exports.getStatusById = getStatusById;
exports.createStatus = createStatus;
exports.updateStatus = updateStatus;
exports.deleteStatus = deleteStatus;
const express_1 = require("express");
const service = __importStar(require("../services/statusService"));
const Utilities_1 = require("../utils/Utilities");
async function getStatuses(req, res, next) {
    try {
        const statuses = await service.getAllStatuses();
        res.status(200).json((0, Utilities_1.formatResponse)(statuses, 'Статуси отримано'));
    }
    catch (error) {
        next(error);
    }
}
async function getStatusById(req, res, next) {
    try {
        const status = await service.getStatusById(Number(req.params.id));
        res.status(200).json((0, Utilities_1.formatResponse)(status, 'Статус знайдено'));
    }
    catch (error) {
        next(error);
    }
}
async function createStatus(req, res, next) {
    try {
        const { name, description } = req.body;
        const newStatus = await service.createStatus(name, description);
        res.status(201).json((0, Utilities_1.formatResponse)(newStatus, 'Статус створено'));
    }
    catch (error) {
        next(error);
    }
}
async function updateStatus(req, res, next) {
    try {
        const updated = await service.updateStatus(Number(req.params.id), req.body.name, req.body.description);
        res.status(200).json((0, Utilities_1.formatResponse)(updated, 'Статус оновлено'));
    }
    catch (error) {
        next(error);
    }
}
async function deleteStatus(req, res, next) {
    try {
        await service.deleteStatus(Number(req.params.id));
        res.status(200).json((0, Utilities_1.formatResponse)(null, 'Статус видалено'));
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=statusController.js.map