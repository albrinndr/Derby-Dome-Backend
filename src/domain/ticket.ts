interface TicketI {
    userId: string;
    fixtureId: string;
    stand: string;
    section: string;
    ticketCount: number;
    seats: [{
        row: string;
        userSeats: number[];
    }];
    price: number;
    paymentType: string;
    coupon: boolean;
    qrCode?: string;
    isCancelled?: boolean;
    cancelledDate?: Date;
}
export default TicketI;
