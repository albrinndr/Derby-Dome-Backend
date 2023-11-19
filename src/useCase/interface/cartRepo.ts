interface CartRepo {
    save(data: any): Promise<{}>;
    cartDataForBooking(userId: string, fixtureId: string): Promise<any>;
    deleteByUserId(userId: string): Promise<any>;
    deleteByCartId(id: string): Promise<any>;
}

export default CartRepo;
