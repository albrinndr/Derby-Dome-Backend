"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const qrcode_1 = __importDefault(require("qrcode"));
class GenerateQRCode {
    generateQR(data) {
        const dataJSON = JSON.stringify(data);
        return new Promise((resolve, reject) => {
            qrcode_1.default.toDataURL(dataJSON, function (err, code) {
                if (err) {
                    console.log(err);
                }
                else {
                    resolve(code);
                }
            });
        });
    }
}
exports.default = GenerateQRCode;
