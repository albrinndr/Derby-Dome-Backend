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
class CartUseCase {
    constructor(GenerateSeats, StadiumRepository, FixtureRepository, CartRepository, ScheduleTask) {
        this.GenerateSeats = GenerateSeats;
        this.StadiumRepository = StadiumRepository;
        this.FixtureRepository = FixtureRepository;
        this.CartRepository = CartRepository;
        this.ScheduleTask = ScheduleTask;
    }
    addToCart(bookingData) {
        return __awaiter(this, void 0, void 0, function* () {
            const seatsPrices = yield this.StadiumRepository.getSeatPrices();
            const fixtureFullData = yield this.FixtureRepository.findByIdNotCancelled(bookingData.fixtureId);
            const fixtureData = fixtureFullData.seats;
            const sectionData = fixtureData[bookingData.stand][bookingData.section];
            const totalSeats = bookingData.section == 'premium' ?
                this.GenerateSeats.generateSeatNumbers('C', sectionData.C.count || 0, 'D', sectionData.D.count || 0, bookingData.ticketCount, sectionData.C.seats, sectionData.D.seats) : this.GenerateSeats.generateSeatNumbers('E', sectionData.E.count || 0, 'F', sectionData.F.count || 0, bookingData.ticketCount, sectionData.E.seats, sectionData.F.seats);
            //user seat price
            const stadiumStandPrice = seatsPrices[bookingData.stand];
            const stadiumSeatPrice = stadiumStandPrice[bookingData.section];
            const cartData = {
                userId: bookingData.userId,
                fixtureId: bookingData.fixtureId,
                stand: bookingData.stand,
                section: bookingData.section,
                seats: totalSeats,
                ticketCount: bookingData.ticketCount,
                price: bookingData.ticketCount * stadiumSeatPrice
            };
            yield this.CartRepository.deleteByUserId(bookingData.userId);
            const cart = yield this.CartRepository.save(cartData);
            yield this.ScheduleTask.removeFromCart(() => this.CartRepository.deleteByCartId(cart._id));
            return {
                status: 200,
                data: cart
            };
        });
    }
    addToCartPremium(bookingData) {
        return __awaiter(this, void 0, void 0, function* () {
            const seatsPrices = yield this.StadiumRepository.getSeatPrices();
            const stadiumStandPrice = seatsPrices[bookingData.stand];
            const stadiumSeatPrice = stadiumStandPrice[bookingData.section];
            const cartData = {
                userId: bookingData.userId,
                fixtureId: bookingData.fixtureId,
                stand: bookingData.stand,
                section: bookingData.section,
                seats: bookingData.seats,
                ticketCount: bookingData.ticketCount,
                price: bookingData.ticketCount * stadiumSeatPrice
            };
            yield this.CartRepository.deleteByUserId(bookingData.userId);
            const cart = yield this.CartRepository.save(cartData);
            yield this.ScheduleTask.removeFromCart(() => this.CartRepository.deleteByCartId(cart._id));
            return {
                status: 200,
                data: cart
            };
        });
    }
}
exports.default = CartUseCase;
