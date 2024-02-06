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
class LoyaltyOfferController {
    constructor(LoyaltyOfferCase) {
        this.LoyaltyOfferCase = LoyaltyOfferCase;
    }
    addNewOffer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const offer = yield this.LoyaltyOfferCase.addNewOffer(req.body);
                res.status(offer.status).json(offer.data);
            }
            catch (error) {
                const err = error;
                res.status(400).json(err.message);
            }
        });
    }
    editOffer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, discount, coins, minPrice } = req.body;
                const offer = yield this.LoyaltyOfferCase.editOffer(id, discount, coins, minPrice);
                res.status(offer.status).json(offer.data);
            }
            catch (error) {
                const err = error;
                res.status(400).json(err.message);
            }
        });
    }
    deleteOffer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const offer = yield this.LoyaltyOfferCase.deleteOffer(req.params.id);
                res.status(offer.status).json(offer.data);
            }
            catch (error) {
                const err = error;
                res.status(400).json(err.message);
            }
        });
    }
    allOffers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const offer = yield this.LoyaltyOfferCase.allOffers();
                res.status(offer.status).json(offer.data);
            }
            catch (error) {
                const err = error;
                res.status(400).json(err.message);
            }
        });
    }
    userCoinRedeem(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.LoyaltyOfferCase.userCoinRedeem(req.userId);
                res.status(result.status).json(result.data);
            }
            catch (error) {
                const err = error;
                res.status(400).json(err.message);
            }
        });
    }
    ;
    createUserCoupon(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const coupon = yield this.LoyaltyOfferCase.createOfferCoupon(req.userId, req.body.id);
                res.status(coupon.status).json(coupon.data);
            }
            catch (error) {
                const err = error;
                res.status(400).json(err.message);
            }
        });
    }
}
exports.default = LoyaltyOfferController;
