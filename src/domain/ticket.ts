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
    coupon: boolean | string;
    qrCode?: string;
    isCancelled?: boolean;
    cancelledDate?: Date;
}

export interface CheckoutTicketI {
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
    coupon: any;
    qrCode?: string;
    isCancelled?: boolean;
    cancelledDate?: Date;
}
export default TicketI;
