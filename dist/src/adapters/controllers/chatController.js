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
Object.defineProperty(exports, "__esModule", { value: true });
class ChatController {
    constructor(ChatCase) {
        this.ChatCase = ChatCase;
    }
    sendMessage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const senderId = req.userId || '';
                const text = req.body.text;
                const data = {
                    senderId: senderId,
                    text
                };
                const message = yield this.ChatCase.sendMessage(data);
                res.status(message.status).json(message.data);
            }
            catch (error) {
                const err = error;
                res.status(400).json(err.message);
            }
        });
    }
    getMessages(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const messages = yield this.ChatCase.allMessages();
                res.status(messages.status).json(messages.data);
            }
            catch (error) {
                const err = error;
                res.status(400).json(err.message);
            }
        });
    }
}
exports.default = ChatController;
