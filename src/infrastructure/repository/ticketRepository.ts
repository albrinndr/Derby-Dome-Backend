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
        const tickets = await TicketModel.find({ userId })
        return tickets;
    }
}
export default TicketRepository;
