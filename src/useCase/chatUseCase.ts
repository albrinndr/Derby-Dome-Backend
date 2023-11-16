import ChatRepository from "../infrastructure/repository/chatRepository";

class ChatUseCase {
    private ChatRepository: ChatRepository;
    constructor(ChatRepository: ChatRepository) {
        this.ChatRepository = ChatRepository;
    }

    async sendMessage(data: Chat) {
        const newMessage = await this.ChatRepository.sendMessage(data);
        return {
            status: 200,
            data: newMessage
        };
    }

    async allMessages() {
        const messages = await this.ChatRepository.getMessages();
        return {
            status: 200,
            data: messages
        };
    }
}

export default ChatUseCase;
