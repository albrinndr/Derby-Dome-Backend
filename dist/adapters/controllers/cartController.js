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
class CartController {
    constructor(cartCase) {
        this.cartCase = cartCase;
    }
    addToCart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.body.type === 'normal') {
                    const data = {
                        userId: req.userId || '',
                        fixtureId: req.body.fixtureId,
                        stand: req.body.stand,
                        section: req.body.section,
                        ticketCount: req.body.ticketCount
                    };
                    const result = yield this.cartCase.addToCart(data);
                    res.status(result.status).json(result.data);
                }
                else if (req.body.type === 'vip') {
                    const data = {
                        userId: req.userId || '',
                        fixtureId: req.body.fixtureId,
                        stand: req.body.stand,
                        section: req.body.section,
                        ticketCount: req.body.ticketCount,
                        seats: req.body.seats
                    };
                    const result = yield this.cartCase.addToCartPremium(data);
                    res.status(result.status).json(result.data);
                }
            }
            catch (error) {
                const err = error;
                res.status(400).json(err.message);
            }
        });
    }
}
exports.default = CartController;
