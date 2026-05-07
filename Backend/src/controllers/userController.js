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
exports.getUsers = getUsers;
exports.getUserById = getUserById;
exports.createUser = createUser;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
const express_1 = require("express");
const service = __importStar(require("../services/userService"));
const Utilities_1 = require("../utils/Utilities");
const AppError_1 = require("../errors/AppError");
async function getUsers(req, res, next) {
    try {
        const users = await service.getAllUsers();
        res.status(200).json((0, Utilities_1.formatResponse)(users, 'Користувачів отримано'));
    }
    catch (error) {
        next(error);
    }
}
async function getUserById(req, res, next) {
    try {
        const user = await service.getUserById(req.params.id);
        res.status(200).json((0, Utilities_1.formatResponse)(user, 'Користувача знайдено'));
    }
    catch (error) {
        next(error);
    }
}
async function createUser(req, res, next) {
    try {
        const { id, name } = req.body;
        const newUser = await service.createUser(id, name);
        res.status(201).json((0, Utilities_1.formatResponse)(newUser, 'Користувача створено'));
    }
    catch (error) {
        next(error);
    }
}
async function updateUser(req, res, next) {
    try {
        const updated = await service.updateUser(req.params.id, req.body.name);
        res.status(200).json((0, Utilities_1.formatResponse)(updated, 'Користувача оновлено'));
    }
    catch (error) {
        next(error);
    }
}
async function deleteUser(req, res, next) {
    try {
        await service.deleteUser(req.params.id);
        res.status(200).json((0, Utilities_1.formatResponse)(null, 'Користувача видалено'));
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=userController.js.map