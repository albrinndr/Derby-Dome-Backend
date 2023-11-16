import { Request, Response } from "express";
import ChatUseCase from "../../useCase/chatUseCase";

class ChatController {
    private ChatCase: ChatUseCase;
    constructor(ChatCase: ChatUseCase) {
        this.ChatCase = ChatCase;
    }

    async sendMessage(req: Request, res: Response) {
        try {
            const senderId = req.userId || '';
            const text = req.body.text;
            const data = {
                senderId: senderId,
                text
            };
            const message = await this.ChatCase.sendMessage(data);
            res.status(message.status).json(message.data);
        } catch (error) {
            const err: Error = error as Error;
            res.status(400).json(err.message);
        }
    }

    async getMessages(req: Request, res: Response) {
        try {
            const messages = await this.ChatCase.allMessages();
            res.status(messages.status).json(messages.data);
        } catch (error) {
            const err: Error = error as Error;
            res.status(400).json(err.message);
        }
    }
}
export default ChatController;
