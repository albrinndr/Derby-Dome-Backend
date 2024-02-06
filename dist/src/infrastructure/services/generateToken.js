"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class JWTToken {
    generateToken(userId, role) {
        const KEY = process.env.JWT_SECRET;
        if (KEY) {
            const token = jsonwebtoken_1.default.sign({ userId, role }, KEY);
            return token;
        }
        throw new Error('JWT key is not defined!');
    }
}
exports.default = JWTToken;
