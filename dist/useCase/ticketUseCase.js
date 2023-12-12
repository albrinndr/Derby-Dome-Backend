"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class TicketUseCase {
    constructor(TicketRepository, FixtureRepository, CartRepository, GenerateQRCode, PaymentRepository, UserRepository, GenerateEmail, CouponRepository) {
        this.TicketRepository = TicketRepository;
        this.FixtureRepository = FixtureRepository;
        this.CartRepository = CartRepository;
        this.GenerateQRCode = GenerateQRCode;
        this.PaymentRepository = PaymentRepository;
        this.UserRepository = UserRepository;
        this.GenerateEmail = GenerateEmail;
        this.CouponRepository = CouponRepository;
    }
    addNewTicket(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const verifyCart = yield this.CartRepository.cartDataForCheckout(data.userId);
            if (verifyCart) {
                //updating coupon
                if (data.coupon.isApplied) {
                    if (data.coupon.isLoyalty) {
                        yield this.CouponRepository.applyLoyaltyCoupon(data.coupon.isApplied);
                    }
                    else {
                        yield this.CouponRepository.applyCoupon(data.userId, data.coupon.isApplied);
                    }
                    data.coupon = true;
                }
                //update user coin
                let COINS = 0;
                if (data.section === 'vip') {
                    COINS = 15 * data.seats.length;
                }
                else if (data.section === 'premium') {
                    COINS = 10 * data.seats.length;
                }
                else {
                    COINS = 5 * data.seats.length;
                }
                const currUser = yield this.UserRepository.findById(data.userId);
                if (currUser) {
                    currUser.loyaltyCoins = currUser.loyaltyCoins + COINS;
                    yield this.UserRepository.save(currUser);
                }
                //updating fixture seats
                if (data.section !== 'vip') {
                    for (const seat of data.seats) {
                        yield this.FixtureRepository.updateNormalSeats(data.fixtureId, data.stand, data.section, seat.row, seat.userSeats.length, seat.userSeats);
                    }
                }
                else {
                    for (const seat of data.seats) {
                        yield this.FixtureRepository.updateVipSeats(data.fixtureId, data.stand, seat.row, seat.userSeats.length, seat.userSeats);
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
                const fixtureData = yield this.FixtureRepository.findByIdNotCancelled(data.fixtureId);
                //seat display for qr changing
                const userSeats = data.seats;
                const formattedArray = userSeats.flatMap(({ row, userSeats }) => userSeats.map(seat => `${row}${seat}`));
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
                const QRCode = yield this.GenerateQRCode.generateQR(qrData);
                //updating user wallet
                if (data.paymentType === 'wallet') {
                    yield this.UserRepository.updateWalletBalance(data.userId, data.price, 'decrement');
                }
                //saving ticket
                const ticketSaveData = Object.assign(Object.assign({}, data), { qrCode: QRCode });
                const ticket = yield this.TicketRepository.save(ticketSaveData);
                //deleting user cart
                yield this.CartRepository.deleteByUserId(data.userId);
                // -------------sending email to user---------
                const email = verifyCart.userId.email;
                const gameName = `${fixtureData.clubId.name} vs ${fixtureData.awayTeam}`;
                const seats = `${data.stand} stand - ( ${formattedSeats} )`;
                const price = data.price;
                const qrCode = QRCode;
                //convert data
                const dateString = fixtureData.date;
                const dateChanged = new Date(dateString);
                const monthAndDay = dateChanged.toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                });
                const year = dateChanged.getUTCFullYear();
                const date = `${monthAndDay} - ${year}`;
                //convert time
                const originalTime = fixtureData.time;
                const [hours, minutes] = originalTime.split(":");
                const formattedTime = new Date(0, 0, 0, parseInt(hours, 10), parseInt(minutes, 10)).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                });
                const sentEmail = yield this.GenerateEmail.sendTicket(email, gameName, formattedTime, date, seats, price, qrCode);
                return {
                    status: 200,
                    data: ticket
                };
            }
            else {
                return {
                    status: 400,
                    data: { message: 'An error occurred! Please try again' }
                };
            }
        });
    }
    verifyOnlinePayment(userId, fixtureId, price) {
        return __awaiter(this, void 0, void 0, function* () {
            const verifyCart = yield this.CartRepository.cartDataForCheckout(userId);
            if (verifyCart && verifyCart.fixtureId.toString() === fixtureId) {
                const fixtureData = yield this.FixtureRepository.findByIdNotCancelled(fixtureId);
                const paymentText = `${fixtureData.clubId.name} vs ${fixtureData.awayTeam}`;
                const stripeId = yield this.PaymentRepository.confirmPayment(price, paymentText);
                return {
                    status: 200,
                    data: { stripeSessionId: stripeId }
                };
            }
            else {
                return {
                    status: 400,
                    data: { message: 'An error occurred! Please try again later.' }
                };
            }
        });
    }
    getUserTickets(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const tickets = yield this.TicketRepository.userTickets(userId);
            tickets.sort((a, b) => b.createdAt - a.createdAt);
            const fixtures = new Set();
            for (const ticket of tickets) {
                const fixture = yield this.FixtureRepository.findByIdNotCancelled(ticket.fixtureId._id);
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
        });
    }
    cancelTicket(ticketId) {
        return __awaiter(this, void 0, void 0, function* () {
            const ticketUpdated = yield this.TicketRepository.cancelTicket(ticketId);
            if (ticketUpdated) {
                const ticket = yield this.TicketRepository.findOneById(ticketId);
                for (const seat of ticket.seats) {
                    yield this.FixtureRepository.updateSeatsOnCancel(ticket.fixtureId, ticket.stand, ticket.section, seat.row, seat.userSeats.length, seat.userSeats);
                }
                const user = yield this.UserRepository.findById(ticket.userId);
                const wallet = (user === null || user === void 0 ? void 0 : user.wallet) || 0;
                const newWallet = wallet + ticket.price;
                if (user) {
                    user.wallet = newWallet;
                    yield this.UserRepository.save(user);
                }
                // const userUpdated = await this.UserRepository.updateWalletBalance(ticket.userId, ticket.price, 'increment');
                return {
                    status: 200,
                    data: 'success'
                };
            }
            else {
                return {
                    status: 400,
                    data: { message: 'Invalid operation!' }
                };
            }
        });
    }
    getAllTicketsDetails() {
        return __awaiter(this, void 0, void 0, function* () {
            const tickets = yield this.TicketRepository.findAllTickets();
            tickets.sort((a, b) => b.fixtureId.date - a.fixtureId.date);
            return {
                status: 200,
                data: tickets
            };
        });
    }
}
exports.default = TicketUseCase;
