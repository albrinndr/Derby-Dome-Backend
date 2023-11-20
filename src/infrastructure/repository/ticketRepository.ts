import TicketI from "../../domain/ticket";
import TicketRepo from "../../useCase/interface/ticketRepo";
import TicketModel from "../db/ticketModel";

class TicketRepository implements TicketRepo {
    async save(data: TicketI): Promise<any> {
        const ticket = new TicketModel(data);
        await ticket.save();
        return ticket;
    }
}
export default TicketRepository;
