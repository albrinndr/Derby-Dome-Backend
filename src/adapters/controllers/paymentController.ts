import { Request, Response } from 'express';
import FixtureUseCase from '../../useCase/fixtureUseCase';
import TicketUseCase from '../../useCase/ticketUseCase';

class PaymentController {
    private FixtureCase: FixtureUseCase;
    private TicketCase: TicketUseCase;
    constructor(FixtureCase: FixtureUseCase, TicketCase: TicketUseCase) {
        this.FixtureCase = FixtureCase;
        this.TicketCase = TicketCase;
    }

    async verifyPayment(req: Request, res: Response) {
        let event = req.body;

        if (event.type === 'checkout.session.completed') {
            const paymentDataClub = req.app.locals.paymentDataClub;
            const paymentDataUser = req.app.locals.paymentDataUser;
            if (paymentDataClub != null) {
                await this.FixtureCase.addNewFixture(paymentDataClub.data);
                req.app.locals.paymentDataClub = null;
            }
            if (paymentDataUser != null) {
                await this.TicketCase.addNewTicket(paymentDataUser);
                req.app.locals.paymentDataUser=null
            }
            return;
        }
    }
}

export default PaymentController;
