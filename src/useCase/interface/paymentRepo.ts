interface Payment {
    confirmPayment(price: number, text: string): Promise<any>;
}