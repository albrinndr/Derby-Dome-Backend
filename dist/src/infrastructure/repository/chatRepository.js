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
const chatModel_1 = __importDefault(require("../db/chatModel"));
class ChatRepository {
    sendMessage(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = new chatModel_1.default(data);
            yield message.save();
            return message;
        });
    }
    getMessages() {
        return __awaiter(this, void 0, void 0, function* () {
            const messages = yield chatModel_1.default.find().populate('senderId');
            return messages;
        });
    }
}
exports.default = ChatRepository;
