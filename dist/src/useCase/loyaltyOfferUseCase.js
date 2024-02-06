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
class LoyaltyOfferUseCase {
    constructor(LoyaltyOfferRepository, CouponRepository, GenerateCoupon, UserRepository) {
        this.LoyaltyOfferRepository = LoyaltyOfferRepository;
        this.CouponRepository = CouponRepository;
        this.GenerateCoupon = GenerateCoupon;
        this.UserRepository = UserRepository;
    }
    addNewOffer(offer) {
        return __awaiter(this, void 0, void 0, function* () {
            const newOffer = yield this.LoyaltyOfferRepository.save(offer);
            return {
                status: 200,
                data: newOffer
            };
        });
    }
    editOffer(id, discount, coins, minPrice) {
        return __awaiter(this, void 0, void 0, function* () {
            const currOffer = yield this.LoyaltyOfferRepository.findById(id);
            if (currOffer) {
                currOffer.minPrice = minPrice || currOffer.minPrice;
                currOffer.coins = coins || currOffer.coins;
                currOffer.discount = discount || currOffer.discount;
                const updatedOffer = yield this.LoyaltyOfferRepository.save(currOffer);
                return {
                    status: 200,
                    data: updatedOffer
                };
            }
            else {
                return {
                    status: 200,
                    data: { message: 'Invalid operation' }
                };
            }
        });
    }
    deleteOffer(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleted = yield this.LoyaltyOfferRepository.deleteOne(id);
            if (deleted) {
                return {
                    status: 200,
                    data: 'Offer removed!'
                };
            }
            else {
                return {
                    status: 200,
                    data: { message: 'Invalid operation' }
                };
            }
        });
    }
    allOffers() {
        return __awaiter(this, void 0, void 0, function* () {
            const offers = yield this.LoyaltyOfferRepository.findAll();
            return {
                status: 200,
                data: offers
            };
        });
    }
    createOfferCoupon(userId, offerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const coupons = yield this.CouponRepository.findAllCouponsForLoyalty();
            const name = yield this.GenerateCoupon.createUniqueCoupon(coupons);
            const offer = yield this.LoyaltyOfferRepository.findById(offerId);
            const user = yield this.UserRepository.findById(userId);
            if (user && user.loyaltyCoins >= offer.coins) {
                const startingDate = new Date();
                startingDate.setHours(0, 0, 0, 0);
                const endingDate = new Date(startingDate.getTime() + 20 * 24 * 60 * 60 * 1000);
                const newCoupon = {
                    name,
                    desc: `₹${offer.discount} OFF on purchase above ${offer.minPrice}`,
                    minPrice: offer.minPrice,
                    discount: offer.discount,
                    startingDate,
                    endingDate,
                    isLoyalty: true,
                    loyaltyId: userId.toString(),
                    loyaltyUsed: false
                };
                const coupon = yield this.CouponRepository.save(newCoupon);
                const user = yield this.UserRepository.findById(userId);
                if (user) {
                    user.loyaltyCoins = user.loyaltyCoins - offer.coins;
                    yield this.UserRepository.save(user);
                }
                return {
                    status: 200,
                    data: coupon
                };
            }
            else {
                return {
                    status: 400,
                    data: { message: 'Insufficient derby coins!' }
                };
            }
        });
    }
    userCoinRedeem(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const coupons = yield this.CouponRepository.findUserAvailableLoyaltyCoupons(userId);
            const offers = yield this.LoyaltyOfferRepository.findAll();
            return {
                status: 200,
                data: {
                    offers,
                    coupons
                }
            };
        });
    }
}
exports.default = LoyaltyOfferUseCase;
