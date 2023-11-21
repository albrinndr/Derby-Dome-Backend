import TicketI from "../../domain/ticket";
import TicketRepo from "../../useCase/interface/ticketRepo";
import TicketModel from "../db/ticketModel";

class TicketRepository implements TicketRepo {
    async save(data: TicketI): Promise<any> {
        const ticket = new TicketModel(data);
        await ticket.save();
        return ticket;
    }

    async userTickets(userId: string): Promise<[] | any> {
        const tickets = await TicketModel.find({ userId });
        return tickets;
    }

    async cancelTicket(ticketId: string): Promise<any> {
        try {
            const ticket = await TicketModel.updateOne({ _id: ticketId }, {
                $set: {
                    isCancelled: true,
                    cancelledDate: new Date()
                }
            });
            if (ticket) return true;
            return false;
        } catch (error) {
            return false;
        }
    }

    async findOneById(ticketId: string): Promise<any> {
        try {
            const ticket = await TicketModel.findOne({ _id: ticketId });
            return ticket;
        } catch (error) {
        }
    }
}
export default TicketRepository;
