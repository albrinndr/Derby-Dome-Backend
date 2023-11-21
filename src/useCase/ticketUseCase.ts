import TicketI from "../domain/ticket";
import CartRepository from "../infrastructure/repository/cartRepository";
import FixtureRepository from "../infrastructure/repository/fixtureRepository";
import TicketRepository from "../infrastructure/repository/ticketRepository";
import GenerateQRCode from "../infrastructure/services/generateQrCode";
import PaymentRepository from "../infrastructure/repository/paymentRepository";
import UserRepository from "../infrastructure/repository/userRepository";


class TicketUseCase {
    private TicketRepository: TicketRepository;
    private FixtureRepository: FixtureRepository;
    private CartRepository: CartRepository;
    private GenerateQRCode: GenerateQRCode;
    private PaymentRepository: PaymentRepository;
    private UserRepository: UserRepository;

    constructor(
        TicketRepository: TicketRepository,
        FixtureRepository: FixtureRepository,
        CartRepository: CartRepository,
        GenerateQRCode: GenerateQRCode,
        PaymentRepository: PaymentRepository,
        UserRepository: UserRepository
    ) {
        this.TicketRepository = TicketRepository;
        this.FixtureRepository = FixtureRepository;
        this.CartRepository = CartRepository;
        this.GenerateQRCode = GenerateQRCode;
        this.PaymentRepository = PaymentRepository;
        this.UserRepository = UserRepository;
    }

    async addNewTicket(data: TicketI) {
        const verifyCart = await this.CartRepository.cartDataForCheckout(data.userId);
        if (verifyCart) {
            //updating fixture seats

            if (data.section !== 'vip') {
                data.seats.forEach(async (seat) => {
                    await this.FixtureRepository.updateNormalSeats(
                        data.fixtureId, data.stand, data.section, seat.row, seat.userSeats.length,seat.userSeats);
                });
            } else {
                data.seats.forEach(async (seat) => {
                    await this.FixtureRepository.updateVipSeats(
                        data.fixtureId, data.stand, seat.row, seat.userSeats.length, seat.userSeats);
                });
            }

            //get fixture data
            const fixtureData = await this.FixtureRepository.findByIdNotCancelled(data.fixtureId);

            //seat display for qr changing
            const userSeats = data.seats;
            const formattedArray = userSeats.flatMap(({ row, userSeats }) =>
                userSeats.map(seat => `${row}${seat}`)
            );
            const formattedSeats = formattedArray.join(', ');

            //qr code gen
            const qrData = {
                customerId: data.userId,
                matchId: data.fixtureId,
                match: `${fixtureData.clubId.name} vs ${fixtureData.awayTeam}`,
                stand: data.stand,
                section: data.section,
                seats: formattedSeats,
                price: data.price,
            };
            const QRCode = await this.GenerateQRCode.generateQR(qrData);

            //updating user wallet
            if (data.paymentType === 'wallet') {
                await this.UserRepository.updateWalletBalance(data.userId, data.price, 'decrement');
            }

            //saving ticket
            const ticketSaveData = { ...data, qrCode: QRCode };
            const ticket = await this.TicketRepository.save(ticketSaveData);

            //deleting user cart
            await this.CartRepository.deleteByUserId(data.userId);

            return {
                status: 200,
                data: ticket
            };
        } else {
            return {
                status: 400,
                data: { message: 'An error occurred! Please try again' }
            };
        }
    }

    async verifyOnlinePayment(userId: string, fixtureId: string, price: number) {
        const verifyCart = await this.CartRepository.cartDataForCheckout(userId);


        if (verifyCart && verifyCart.fixtureId.toString() === fixtureId) {
            const fixtureData = await this.FixtureRepository.findByIdNotCancelled(fixtureId);
            const paymentText = `${fixtureData.clubId.name} vs ${fixtureData.awayTeam}`;

            const stripeId = await this.PaymentRepository.confirmPayment(price, paymentText);

            return {
                status: 200,
                data: { stripeSessionId: stripeId }
            };

        } else {
            return {
                status: 400,
                data: { message: 'An error occurred! Please try again later.' }
            };
        }
    }

    async getUserTickets(userId: string) {
        const tickets = await this.TicketRepository.userTickets(userId);

        const fixtures = new Set();
        for (const ticket of tickets) {
            const fixture = await this.FixtureRepository.findByIdNotCancelled(ticket.fixtureId);
            fixtures.add(fixture);
        }
        const ticketFixtures = [...new Set(fixtures)];

        return {
            status: 200,
            data: {
                tickets,
                ticketFixtures
            }
        };
    }

    
}

export default TicketUseCase;
