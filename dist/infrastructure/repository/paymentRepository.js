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
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const CLIENT_URL = process.env.CORS_URL;
class PaymentRepository {
    confirmPayment(price, text) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [
                    {
                        price_data: {
                            currency: 'inr',
                            product_data: {
                                name: text,
                            },
                            unit_amount: price * 100,
                        },
                        quantity: 1,
                    },
                ],
                mode: 'payment',
                success_url: `${CLIENT_URL}/paymentSuccess`,
                cancel_url: `${CLIENT_URL}/paymentFailed`,
            });
            return session.id;
        });
    }
}
exports.default = PaymentRepository;
