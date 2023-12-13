import TicketI, { CheckoutTicketI } from "../domain/ticket";
import CartRepository from "../infrastructure/repository/cartRepository";
import FixtureRepository from "../infrastructure/repository/fixtureRepository";
import TicketRepository from "../infrastructure/repository/ticketRepository";
import GenerateQRCode from "../infrastructure/services/generateQrCode";
import PaymentRepository from "../infrastructure/repository/paymentRepository";
import UserRepository from "../infrastructure/repository/userRepository";
import GenerateEmail from "../infrastructure/services/sendMail";
import CouponRepository from "../infrastructure/repository/couponRepository";


class TicketUseCase {
    private TicketRepository: TicketRepository;
    private FixtureRepository: FixtureRepository;
    private CartRepository: CartRepository;
    private GenerateQRCode: GenerateQRCode;
    private PaymentRepository: PaymentRepository;
    private UserRepository: UserRepository;
    private GenerateEmail: GenerateEmail;
    private CouponRepository: CouponRepository;

    constructor(
        TicketRepository: TicketRepository,
        FixtureRepository: FixtureRepository,
        CartRepository: CartRepository,
        GenerateQRCode: GenerateQRCode,
        PaymentRepository: PaymentRepository,
        UserRepository: UserRepository,
        GenerateEmail: GenerateEmail,
        CouponRepository: CouponRepository
    ) {
        this.TicketRepository = TicketRepository;
        this.FixtureRepository = FixtureRepository;
        this.CartRepository = CartRepository;
        this.GenerateQRCode = GenerateQRCode;
        this.PaymentRepository = PaymentRepository;
        this.UserRepository = UserRepository;
        this.GenerateEmail = GenerateEmail;
        this.CouponRepository = CouponRepository;
    }

    async addNewTicket(data: CheckoutTicketI) {
        const verifyCart = await this.CartRepository.cartDataForCheckout(data.userId);
        if (verifyCart) {
            //updating coupon
            if (data.coupon.isApplied) {
                if (data.coupon.isLoyalty) {
                    await this.CouponRepository.applyLoyaltyCoupon(data.coupon.isApplied as string);
                } else {
                    await this.CouponRepository.applyCoupon(data.userId, data.coupon.isApplied as string);
                }
                data.coupon = true;
            } else {
                data.coupon = false;
            }

            //update user coin
            let COINS = 0;
            if (data.section === 'vip') {
                COINS = 15 * data.seats.length;
            } else if (data.section === 'premium') {
                COINS = 10 * data.seats.length;
            } else {
                COINS = 5 * data.seats.length;
            }

            const currUser = await this.UserRepository.findById(data.userId);
            if (currUser) {
                currUser.loyaltyCoins = currUser.loyaltyCoins + COINS;
                await this.UserRepository.save(currUser);
            }

            //updating fixture seats

            if (data.section !== 'vip') {
                for (const seat of data.seats) {
                    await this.FixtureRepository.updateNormalSeats(
                        data.fixtureId, data.stand, data.section, seat.row, seat.userSeats.length, seat.userSeats
                    );
                }
            } else {
                for (const seat of data.seats) {
                    await this.FixtureRepository.updateVipSeats(
                        data.fixtureId, data.stand, seat.row, seat.userSeats.length, seat.userSeats
                    );
                }
            }

            // if (data.section !== 'vip') {
            //     data.seats.forEach(async (seat) => {
            //         await this.FixtureRepository.updateNormalSeats(
            //             data.fixtureId, data.stand, data.section, seat.row, seat.userSeats.length, seat.userSeats);
            //     });
            // } else {
            //     data.seats.forEach(async (seat) => {
            //         await this.FixtureRepository.updateVipSeats(
            //             data.fixtureId, data.stand, seat.row, seat.userSeats.length, seat.userSeats);
            //     });
            // }

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

            // -------------sending email to user---------
            const email = verifyCart.userId.email;
            const gameName = `${fixtureData.clubId.name} vs ${fixtureData.awayTeam}`;
            const seats = `${data.stand} stand - ( ${formattedSeats} )`;
            const price = data.price;
            const qrCode = QRCode;

            //convert data
            const dateString = fixtureData.date as string;
            const dateChanged = new Date(dateString);
            const monthAndDay = dateChanged.toLocaleDateString('en-US', {
                month: 'long', // or 'long' for full month name
                day: 'numeric',
            });
            const year = dateChanged.getUTCFullYear();
            const date = `${monthAndDay} - ${year}`;

            //convert time
            const originalTime: string = fixtureData.time as string;
            const [hours, minutes] = originalTime.split(":");
            const formattedTime = new Date(0, 0, 0, parseInt(hours, 10), parseInt(minutes, 10)).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            });

            const sentEmail = await this.GenerateEmail.sendTicket(email, gameName, formattedTime, date, seats, price, qrCode);

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
        tickets.sort((a: any, b: any) => b.createdAt - a.createdAt);
        const fixtures = new Set();
        for (const ticket of tickets) {
            const fixture = await this.FixtureRepository.findByIdNotCancelled(ticket.fixtureId._id);
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

    async cancelTicket(ticketId: string) {
        const ticketUpdated = await this.TicketRepository.cancelTicket(ticketId);
        if (ticketUpdated) {
            const ticket: TicketI = await this.TicketRepository.findOneById(ticketId);

            for (const seat of ticket.seats) {
                await this.FixtureRepository.updateSeatsOnCancel(
                    ticket.fixtureId, ticket.stand, ticket.section, seat.row,
                    seat.userSeats.length, seat.userSeats
                );
            }
            const user = await this.UserRepository.findById(ticket.userId);

            const wallet = user?.wallet || 0;

            const newWallet = wallet + ticket.price;

            if (user) {
                user.wallet = newWallet;
                await this.UserRepository.save(user);
            }



            // const userUpdated = await this.UserRepository.updateWalletBalance(ticket.userId, ticket.price, 'increment');
            return {
                status: 200,
                data: 'success'
            };
        } else {
            return {
                status: 400,
                data: { message: 'Invalid operation!' }
            };
        }
    }


    async getAllTicketsDetails() {
        const tickets = await this.TicketRepository.findAllTickets();
        tickets.sort((a: any, b: any) => b.fixtureId.date - a.fixtureId.date);
        return {
            status: 200,
            data: tickets
        };
    }
}

export default TicketUseCase;
