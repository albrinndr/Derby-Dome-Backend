interface SENDMAIL {
    sendMail(email: string, otp: number): void;
    sendTicket(email: string, gameName: string, time: string, date: string, seats: string, price: number,qrCode:string): any;
}
export default SENDMAIL;
