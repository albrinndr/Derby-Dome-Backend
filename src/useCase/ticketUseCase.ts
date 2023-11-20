import TicketI from "../domain/ticket";
import CartRepository from "../infrastructure/repository/cartRepository";
import FixtureRepository from "../infrastructure/repository/fixtureRepository";
import TicketRepository from "../infrastructure/repository/ticketRepository";
import GenerateQRCode from "../infrastructure/services/generateQrCode";

class TicketUseCase {
    private TicketRepository: TicketRepository;
    private FixtureRepository: FixtureRepository;
    private CartRepository: CartRepository;
    private GenerateQRCode: GenerateQRCode;

    constructor(
        TicketRepository: TicketRepository,
        FixtureRepository: FixtureRepository,
        CartRepository: CartRepository,
        GenerateQRCode: GenerateQRCode,
    ) {
        this.TicketRepository = TicketRepository,
            this.FixtureRepository = FixtureRepository,
            this.CartRepository = CartRepository,
            this.GenerateQRCode = GenerateQRCode;
    }

    async addNewTicket(data: TicketI) {
        const verifyCart = await this.CartRepository.cartDataForCheckout(data.userId);
        if (verifyCart) {
            //updating fixture seats

            if (data.section !== 'vip') {
                data.seats.forEach(async (seat) => {
                    await this.FixtureRepository.updateNormalSeats(
                        data.fixtureId, data.stand, data.section, seat.row, seat.userSeats.length);
                });
            } else {
                data.seats.forEach(async (seat) => {
                    await this.FixtureRepository.updateVipSeats(
                        data.fixtureId, data.stand, seat.row, seat.userSeats.length,seat.userSeats);
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
}

export default TicketUseCase;
