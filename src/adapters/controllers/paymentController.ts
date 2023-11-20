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
            const paymentDataClub = req.app.locals.paymentDataClub;
            if (paymentDataClub != null) {
                await this.FixtureCase.addNewFixture(paymentDataClub.data);
                req.app.locals.paymentDataClub = null;
            }
            return;
        }
    }
}

export default PaymentController;
