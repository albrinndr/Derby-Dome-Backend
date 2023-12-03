import FirebaseNotificationI, { TokenI } from "../../useCase/interface/notificationI";

const admin = require('firebase-admin');
const serviceAccount = require('../../../firebase.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

class FirebaseNotification implements FirebaseNotificationI {

    async sendWebPushNotification(tokens: TokenI[]): Promise<any> {
        const messages = tokens.map(token => ({
            notification: {
                title: 'Book your tickets now!!!',
                body: `${token.club} scheduled a new match!`,
                image: token.poster,
            },
            token: token.token,
        }));

        try {
            const responses = await Promise.all(
                messages.map(message => admin.messaging().send(message))
            );
            if (responses) console.log('messages sent!');
        } catch (error) {
            console.log('Error sending notification');
        }

    }
}

export default FirebaseNotification;
