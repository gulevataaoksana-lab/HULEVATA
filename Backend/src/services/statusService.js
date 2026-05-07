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
exports.getAllStatuses = getAllStatuses;
exports.getStatusById = getStatusById;
exports.createStatus = createStatus;
exports.updateStatus = updateStatus;
exports.deleteStatus = deleteStatus;
const statusRepo = __importStar(require("../repositories/statusRepository"));
const AppError_1 = require("../errors/AppError");
async function getAllStatuses() {
    return await statusRepo.getAll();
}
async function getStatusById(id) {
    const status = await statusRepo.getById(id);
    if (!status)
        throw new AppError_1.AppError("Статус не знайдено", 404);
    return status;
}
async function createStatus(name, description) {
    if (!name)
        throw new AppError_1.AppError("Назва статусу обов'язкова", 400);
    return await statusRepo.add(name, description);
}
async function updateStatus(id, name, description) {
    const exists = await statusRepo.getById(id);
    if (!exists)
        throw new AppError_1.AppError("Статус не знайдено", 404);
    return await statusRepo.update(id, name, description);
}
async function deleteStatus(id) {
    const result = await statusRepo.remove(id);
    if (result.changes === 0)
        throw new AppError_1.AppError("Статус не знайдено", 404);
    return { message: "Статус видалено" };
}
//# sourceMappingURL=statusService.js.map