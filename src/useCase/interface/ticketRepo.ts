import TicketI from "../../domain/ticket";

interface TicketRepo {
    save(data: TicketI): Promise<any>;
    userTickets(userId: string): Promise<[] | any>;
}

export default TicketRepo;
