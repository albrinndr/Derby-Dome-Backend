export interface TokenI {
    token: string;
    club: string;
    poster: string;
}

interface FirebaseNotificationI {
    sendWebPushNotification(tokens: TokenI[]): Promise<any>;
}

export default FirebaseNotificationI;
