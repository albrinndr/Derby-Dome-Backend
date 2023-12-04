import TicketI from "../../domain/ticket";

interface TicketRepo {
    save(data: TicketI): Promise<any>;
    userTickets(userId: string): Promise<[] | any>;
    cancelTicket(ticketId: string): Promise<any>;
    clubTicketProfit(clubId: string, year?: string): Promise<any>;
    clubTicketSectionCountForDashboard(clubId: string): Promise<any>;
    fixtureTicketSales(fixtureId: string): Promise<any>;
    sectionSelectionCountAdminDashboard(): Promise<any>;
    ticketsNotCancelled(): Promise<any>;
    ticketSalesDataAdminDashboard(selectedYear?: string): Promise<any>;
    findAllTickets(): Promise<any>;
}

export default TicketRepo;
