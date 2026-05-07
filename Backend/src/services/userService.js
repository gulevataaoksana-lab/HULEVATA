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
exports.getAllUsers = getAllUsers;
exports.getUserById = getUserById;
exports.createUser = createUser;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
const userRepo = __importStar(require("../repositories/userRepository"));
const AppError_1 = require("../errors/AppError");
async function getAllUsers() {
    return await userRepo.getAll();
}
async function getUserById(id) {
    const user = await userRepo.getById(id);
    if (!user)
        throw new AppError_1.AppError(`Користувача з ID ${id} не знайдено`, 404, 'NOT_FOUND');
    return user;
}
async function createUser(id, name) {
    if (!id || !name)
        throw new AppError_1.AppError("ID та ім'я користувача обов'язкові", 400, 'VALIDATION_ERROR');
    const existing = await userRepo.getById(id);
    if (existing)
        throw new AppError_1.AppError("Користувач з таким ID вже існує", 409, 'CONFLICT');
    return await userRepo.add(id, name);
}
async function updateUser(id, name) {
    const user = await userRepo.getById(id);
    if (!user)
        throw new AppError_1.AppError("Користувача не знайдено ", 404, 'NOT_FOUND');
    return await userRepo.update(id, name);
}
async function deleteUser(id) {
    const isDeleted = await userRepo.remove(id);
    if (!isDeleted) {
        throw new AppError_1.AppError("Користувача не знайдено для видалення", 404, 'DELETE_FAILED');
    }
    return { message: "Користувача видалено" };
}
//# sourceMappingURL=userService.js.map