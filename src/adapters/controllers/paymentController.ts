import { Request, Response } from 'express';
import FixtureUseCase from '../../useCase/fixtureUseCase';

class PaymentController {
    private FixtureCase: FixtureUseCase;
    constructor(FixtureCase: FixtureUseCase) {
        this.FixtureCase = FixtureCase;
    }

    async verifyPayment(req: Request, res: Response) {
        let event = req.body;

        if (event.type === 'checkout.session.completed') {
            const paymentData = req.app.locals.paymentData;
            if (paymentData?.user === 'club') {
                await this.FixtureCase.addNewFixture(paymentData.data);
            }
            return;
        }
    }
}

export default PaymentController;
