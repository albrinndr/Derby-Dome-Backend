import { Request, Response } from "express";
import TicketUseCase from "../../useCase/ticketUseCase";

class TicketController {
    private TicketCase: TicketUseCase;
    constructor(TicketCase: TicketUseCase) {
        this.TicketCase = TicketCase;
    }
    async createMatchTicket(req: Request, res: Response) {
        try {
            const data = {
                userId: req.userId || '',
                fixtureId: req.body.fixtureId,
                stand: req.body.stand,
                section: req.body.section,
                ticketCount: req.body.ticketCount,
                seats: req.body.seats,
                price: req.body.price,
                paymentType: req.body.paymentType,
                coupon: req.body.coupon
            };

            if (req.body.paymentType === 'online') {
                const result = await this.TicketCase.verifyOnlinePayment(data.userId, data.fixtureId, data.price);
                req.app.locals.paymentDataUser = data;
                res.status(result.status).json(result.data);
            } else {
                const result = await this.TicketCase.addNewTicket(data);
                res.status(result.status).json(result.data);
            }

        } catch (error) {
            const err: Error = error as Error;
            res.status(400).json(err.message);
        }
    }

    async getUserTickets(req: Request, res: Response) {
        try {
            const userId = req.userId || '';
            const result = await this.TicketCase.getUserTickets(userId);
            res.status(result.status).json(result.data);
        } catch (error) {
            const err: Error = error as Error;
            res.status(400).json(err.message);
        }
    }

}

export default TicketController;
