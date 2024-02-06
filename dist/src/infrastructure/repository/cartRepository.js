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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cartModel_1 = __importDefault(require("../db/cartModel"));
class CartRepository {
    save(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const cart = new cartModel_1.default(data);
            yield cart.save();
            return cart;
        });
    }
    cartDataForBooking(userId, fixtureId) {
        return __awaiter(this, void 0, void 0, function* () {
            //normal finding for the total counting
            const documents = yield cartModel_1.default.find({ userId: { $ne: userId }, fixtureId })
                .select('stand section ticketCount seats')
                .lean()
                .exec();
            const standCounts = {
                north: { vip: 0, economy: 0, premium: 0 },
                south: { vip: 0, economy: 0, premium: 0 },
                east: { vip: 0, economy: 0, premium: 0 },
                west: { vip: 0, economy: 0, premium: 0 },
            };
            documents.forEach((doc) => {
                const { stand, section, ticketCount } = doc;
                if (standCounts[stand]) {
                    standCounts[stand][section] += ticketCount;
                }
            });
            const vipDocuments = yield cartModel_1.default.find({ userId: { $ne: userId }, fixtureId })
                .select('stand section seats')
                .lean()
                .exec();
            const vipCartSeats = {
                north: { A: [], B: [] },
                south: { A: [], B: [] },
                east: { A: [], B: [] },
                west: { A: [], B: [] },
            };
            vipDocuments.forEach((doc) => {
                const { stand, section, seats } = doc;
                if (stand === 'north') {
                    seats.forEach((seat) => {
                        if (seat.row === 'A')
                            vipCartSeats.north.A = seat.userSeats;
                        if (seat.row === 'B')
                            vipCartSeats.north.B = seat.userSeats;
                    });
                }
                if (stand === 'east') {
                    seats.forEach((seat) => {
                        if (seat.row === 'A')
                            vipCartSeats.east.A = seat.userSeats;
                        if (seat.row === 'B')
                            vipCartSeats.east.B = seat.userSeats;
                    });
                }
                if (stand === 'south') {
                    seats.forEach((seat) => {
                        if (seat.row === 'A')
                            vipCartSeats.south.A = seat.userSeats;
                        if (seat.row === 'B')
                            vipCartSeats.south.B = seat.userSeats;
                    });
                }
                if (stand === 'west') {
                    seats.forEach((seat) => {
                        if (seat.row === 'A')
                            vipCartSeats.west.A = seat.userSeats;
                        if (seat.row === 'B')
                            vipCartSeats.west.B = seat.userSeats;
                    });
                }
            });
            return { standCounts, vipCartSeats };
        });
    }
    deleteByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userCart = yield cartModel_1.default.findOne({ userId });
                if (userCart) {
                    yield cartModel_1.default.deleteOne({ userId });
                }
            }
            catch (error) {
            }
        });
    }
    deleteByCartId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const cart = yield cartModel_1.default.findOne({ _id: id });
                if (cart) {
                    yield cartModel_1.default.deleteOne({ _id: id });
                }
            }
            catch (error) {
            }
        });
    }
    cartDataForCheckout(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const cart = yield cartModel_1.default.findOne({ userId }).populate('userId');
                if (cart)
                    return cart;
                return null;
            }
            catch (error) {
                return null;
            }
        });
    }
}
exports.default = CartRepository;
