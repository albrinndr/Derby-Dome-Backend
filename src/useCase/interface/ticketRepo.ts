import TicketI from "../../domain/ticket";

interface TicketRepo {
    save(data: TicketI): Promise<any>;
    userTickets(userId: string): Promise<[] | any>;
    cancelTicket(ticketId: string): Promise<any>;
}

export default TicketRepo;
