import Chat from "../../domain/chat";

interface ChatRepo {
    sendMessage(data: Chat): Promise<{}>;
    getMessages(): Promise<any>;
}
export default ChatRepo;
