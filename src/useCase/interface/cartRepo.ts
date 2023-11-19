interface CartRepo {
    save(data: any): Promise<{}>;
}

export default CartRepo;
