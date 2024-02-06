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
const admin = require('firebase-admin');
const serviceAccount = require('../../../firebase.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
class FirebaseNotification {
    sendWebPushNotification(tokens) {
        return __awaiter(this, void 0, void 0, function* () {
            const messages = tokens.map(token => ({
                notification: {
                    title: 'Book your tickets now!!!',
                    body: `${token.club} scheduled a new match!`,
                    image: token.poster,
                },
                token: token.token,
            }));
            try {
                const responses = yield Promise.all(messages.map(message => admin.messaging().send(message)));
                if (responses)
                    console.log('messages sent!');
            }
            catch (error) {
                console.log('Error sending notification');
            }
        });
    }
}
exports.default = FirebaseNotification;
