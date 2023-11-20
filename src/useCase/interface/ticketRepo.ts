import TicketI from "../../domain/ticket";

interface TicketRepo {
    save(data:TicketI): Promise<any>;
}

export default TicketRepo;
