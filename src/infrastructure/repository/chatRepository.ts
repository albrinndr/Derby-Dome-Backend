import Chat from "../../domain/chat";
import ChatRepo from "../../useCase/interface/chatRepo";
import ChatModel from "../db/chatModel";

class ChatRepository implements ChatRepo {
    async sendMessage(data: Chat): Promise<{}> {
        const message = new ChatModel(data);
        await message.save();
        return message;
    }
    async getMessages(): Promise<any> {
        const messages = await ChatModel.find().populate('senderId')
        return messages;
    }
}

export default ChatRepository;
