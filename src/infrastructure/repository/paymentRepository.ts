const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const CLIENT_URL = process.env.CORS_URL;

class PaymentRepository implements Payment {
    async confirmPayment(price: number, text: string): Promise<any> {
        const session = await stripe.checkout.sessions.create({
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
            success_url: `${CLIENT_URL}/club/paymentSuccess`,
            cancel_url: `${CLIENT_URL}/club/paymentFailed`,
        });

        return session.id;
    }
}

export default PaymentRepository;
