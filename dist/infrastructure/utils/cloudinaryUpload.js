"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const fs_1 = __importDefault(require("fs"));
class CloudinaryUpload {
    upload(filePath, folder) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield cloudinary_1.default.uploader.upload(filePath, { folder: folder });
            fs_1.default.unlink(filePath, (err) => {
                if (err) {
                    console.error('Error deleting file:', err);
                }
            });
            return result;
        });
    }
}
exports.default = CloudinaryUpload;
