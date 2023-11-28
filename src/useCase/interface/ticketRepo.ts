import TicketI from "../../domain/ticket";

interface TicketRepo {
    save(data: TicketI): Promise<any>;
    userTickets(userId: string): Promise<[] | any>;
    cancelTicket(ticketId: string): Promise<any>;
    clubTicketProfit(clubId: string, year?: string): Promise<any>;
    clubTicketSectionCountForDashboard(clubId: string): Promise<any>;
    fixtureTicketSales(fixtureId: string): Promise<any>;
}

export default TicketRepo;
