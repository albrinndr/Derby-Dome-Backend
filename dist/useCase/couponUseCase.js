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
class CouponUseCase {
    constructor(CouponRepository) {
        this.CouponRepository = CouponRepository;
    }
    addCoupon(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const couponExist = yield this.CouponRepository.findByName(data.name);
            if (!couponExist) {
                const coupon = yield this.CouponRepository.save(data);
                return {
                    status: 200,
                    data: coupon
                };
            }
            else {
                return {
                    status: 400,
                    data: { message: 'Coupon Already Exists!' }
                };
            }
        });
    }
    findAllCoupons() {
        return __awaiter(this, void 0, void 0, function* () {
            const coupons = yield this.CouponRepository.findAllCoupons();
            return {
                status: 200,
                data: coupons
            };
        });
    }
    editCoupon(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (data.id) {
                const couponExist = yield this.CouponRepository.findByNameForEdit(data.name, data.id);
                if (!couponExist) {
                    const coupon = yield this.CouponRepository.findById(data.id);
                    if (coupon) {
                        coupon.name = data.name || coupon.name;
                        coupon.desc = data.desc || coupon.desc;
                        coupon.discount = data.discount || coupon.discount;
                        coupon.minPrice = data.minPrice || coupon.minPrice;
                        coupon.startingDate = data.startingDate || coupon.startingDate;
                        coupon.endingDate = data.endingDate || coupon.endingDate;
                        const updatedCoupon = yield this.CouponRepository.save(coupon);
                        return {
                            status: 200,
                            data: updatedCoupon
                        };
                    }
                    else {
                        return {
                            status: 400,
                            data: { message: 'An error occurred! Please try again!' }
                        };
                    }
                }
                else {
                    return {
                        status: 400,
                        data: { message: 'Coupon name already exists!' }
                    };
                }
            }
            else {
                return {
                    status: 400,
                    data: { message: 'An error occurred! Please try again!' }
                };
            }
        });
    }
    deleteCoupon(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleted = yield this.CouponRepository.deleteCoupon(id);
            if (deleted) {
                return {
                    status: 200,
                    data: 'Coupon Deleted'
                };
            }
            else {
                return {
                    status: 400,
                    data: { message: 'An error occurred! Please try again!' }
                };
            }
        });
    }
    couponValidateForCheckout(userId, name, price) {
        return __awaiter(this, void 0, void 0, function* () {
            const coupon = yield this.CouponRepository.findByNameForCheckout(name);
            if (coupon) {
                if ((new Date(coupon.startingDate) > new Date()) || (new Date() > new Date(coupon.endingDate))) {
                    return {
                        status: 400,
                        data: { message: 'Coupon expired!' }
                    };
                }
                else if (coupon.isLoyalty && coupon.loyaltyId != userId) {
                    return {
                        status: 400,
                        data: { message: "Coupon doesn't exist!" }
                    };
                }
                else if (coupon.isLoyalty && coupon.loyaltyId === userId && coupon.loyaltyUsed) {
                    return {
                        status: 400,
                        data: { message: 'Coupon already used!' }
                    };
                }
                else if (coupon.users && coupon.users.includes(userId)) {
                    return {
                        status: 400,
                        data: { message: 'Coupon already used!' }
                    };
                }
                else if (price < coupon.minPrice) {
                    return {
                        status: 400,
                        data: { message: `Minimum purchase should be ₹${coupon.minPrice}` }
                    };
                }
                else {
                    return {
                        status: 200,
                        data: coupon
                    };
                }
            }
            else {
                return {
                    status: 400,
                    data: { message: "Coupon doesn't exist!" }
                };
            }
        });
    }
}
exports.default = CouponUseCase;
