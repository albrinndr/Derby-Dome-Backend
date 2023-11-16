interface ChatRepo {
    sendMessage(data: Chat): Promise<{}>;
    getMessages(): Promise<any>;
}