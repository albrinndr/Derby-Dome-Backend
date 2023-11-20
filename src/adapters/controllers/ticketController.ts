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
            const result = await this.TicketCase.addNewTicket(data);

            res.status(result.status).json(result.data);

        } catch (error) {
            const err: Error = error as Error;
            res.status(400).json(err.message);
        }
    }
}

export default TicketController;
