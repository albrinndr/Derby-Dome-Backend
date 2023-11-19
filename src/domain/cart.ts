interface CartI {
    userId: string;
    fixtureId: string;
    stand: string;
    section: string;
    ticketCount: number;
    seats?: [{
        row: string;
        userSeats: number[];
    }];
    price?: number;
}
export default CartI;
